const CACHE_KEY = 'eden_translation_cache_v1';
const MAX_CACHE_ENTRIES = 600;

type TranslatorInstance = { translate: (text: string) => Promise<string> };
type TranslatorApi = {
  availability?: (options: { sourceLanguage: string; targetLanguage: string }) => Promise<string>;
  create: (options: { sourceLanguage: string; targetLanguage: string }) => Promise<TranslatorInstance>;
};

const memoryCache = new Map<string, string>();
const pendingTranslations = new Map<string, Promise<string>>();
let browserTranslator: Promise<TranslatorInstance | null> | null = null;
let activeRequests = 0;
const requestQueue: Array<() => void> = [];

try {
  const stored = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') as Record<string, string>;
  Object.entries(stored).forEach(([source, translation]) => memoryCache.set(source, translation));
} catch {
  localStorage.removeItem(CACHE_KEY);
}

function saveCache() {
  const entries = [...memoryCache.entries()].slice(-MAX_CACHE_ENTRIES);
  localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(entries)));
}

async function getBrowserTranslator() {
  if (browserTranslator) return browserTranslator;
  browserTranslator = (async () => {
    const api = (globalThis as typeof globalThis & { Translator?: TranslatorApi }).Translator;
    if (!api?.create) return null;
    const options = { sourceLanguage: 'pt', targetLanguage: 'en' };
    const availability = await api.availability?.(options);
    if (availability === 'unavailable') return null;
    return api.create(options);
  })().catch(() => null);
  return browserTranslator;
}

function withRequestLimit<T>(task: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const run = () => {
      activeRequests += 1;
      void task().then(resolve, reject).finally(() => {
        activeRequests -= 1;
        requestQueue.shift()?.();
      });
    };
    if (activeRequests < 4) run();
    else requestQueue.push(run);
  });
}

async function translateChunk(source: string): Promise<string> {
  const cached = memoryCache.get(source);
  if (cached) return cached;

  const browser = await getBrowserTranslator();
  let translated: string;
  if (browser) {
    translated = await browser.translate(source);
  } else {
    const params = new URLSearchParams({ q: source, langpair: 'pt-PT|en-GB' });
    const response = await fetch(`https://api.mymemory.translated.net/get?${params}`, {
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error(`Serviço de tradução indisponível (${response.status}).`);
    const payload = await response.json() as {
      responseStatus?: number;
      responseDetails?: string;
      responseData?: { translatedText?: string };
    };
    if (payload.responseStatus && payload.responseStatus !== 200) {
      throw new Error(payload.responseDetails || 'Limite temporário do serviço de tradução atingido.');
    }
    translated = payload.responseData?.translatedText?.trim() || source;
  }

  memoryCache.set(source, translated);
  saveCache();
  return translated;
}

function splitText(source: string) {
  if (source.length <= 350) return [source];
  const parts = source.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [source];
  const chunks: string[] = [];
  for (const part of parts) {
    const clean = part.trim();
    if (!clean) continue;
    if (clean.length <= 350) chunks.push(clean);
    else for (let index = 0; index < clean.length; index += 350) chunks.push(clean.slice(index, index + 350));
  }
  return chunks;
}

export function translateText(source: string): Promise<string> {
  const clean = source.trim();
  if (!clean) return Promise.resolve(source);
  const existing = pendingTranslations.get(clean);
  if (existing) return existing;

  const request = withRequestLimit(async () => {
    const translated = await Promise.all(splitText(clean).map(translateChunk));
    return translated.join(' ');
  }).finally(() => pendingTranslations.delete(clean));
  pendingTranslations.set(clean, request);
  return request;
}
