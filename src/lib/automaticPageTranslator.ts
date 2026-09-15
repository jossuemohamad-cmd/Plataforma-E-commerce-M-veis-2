import { Language } from '../types';
import { translateText } from '../services/translationService';

const textOriginals = new WeakMap<Text, string>();
const textTranslations = new WeakMap<Text, string>();
const trackedTexts = new Set<Text>();
const attributeOriginals = new WeakMap<Element, Map<string, string>>();
const attributeTranslations = new WeakMap<Element, Map<string, string>>();
const trackedElements = new Set<Element>();
const ATTRIBUTES = ['placeholder', 'title', 'aria-label', 'alt'] as const;
const originalDocumentTitle = document.title;

function shouldSkip(element: Element | null) {
  return !element || Boolean(element.closest('script,style,noscript,code,pre,[translate="no"],[data-no-translate],.material-symbols-outlined'));
}

function isTranslatable(text: string) {
  const clean = text.trim();
  if (clean.length < 2 || !/\p{L}/u.test(clean)) return false;
  if (/^(https?:|[\w.+-]+@[\w.-]+\.|[A-Z]{2,5}-?\d|MZN|USD|EUR)$/i.test(clean)) return false;
  return true;
}

function retainSpacing(original: string, translated: string) {
  const leading = original.match(/^\s*/)?.[0] ?? '';
  const trailing = original.match(/\s*$/)?.[0] ?? '';
  return `${leading}${translated}${trailing}`;
}

async function translateTextNode(node: Text, language: Language, onError: (message: string) => void) {
  if (shouldSkip(node.parentElement) || !isTranslatable(node.nodeValue ?? '')) return;
  const current = node.nodeValue ?? '';
  const previousTranslation = textTranslations.get(node);
  if (!textOriginals.has(node) || (current !== previousTranslation && current !== textOriginals.get(node))) {
    textOriginals.set(node, current);
    trackedTexts.add(node);
  }
  const original = textOriginals.get(node) ?? current;
  if (language === 'PT') {
    if (node.nodeValue !== original) node.nodeValue = original;
    return;
  }
  if (current === previousTranslation) return;
  try {
    const translated = retainSpacing(original, await translateText(original));
    if (document.documentElement.lang === 'en' && node.isConnected) {
      textTranslations.set(node, translated);
      node.nodeValue = translated;
    }
  } catch (error) {
    onError(error instanceof Error ? error.message : 'Falha na tradução automática.');
  }
}

async function translateAttributes(element: Element, language: Language, onError: (message: string) => void) {
  if (shouldSkip(element)) return;
  for (const attribute of ATTRIBUTES) {
    const current = element.getAttribute(attribute);
    if (!current || !isTranslatable(current)) continue;
    let originals = attributeOriginals.get(element);
    let translations = attributeTranslations.get(element);
    if (!originals) {
      originals = new Map();
      attributeOriginals.set(element, originals);
    }
    if (!translations) {
      translations = new Map();
      attributeTranslations.set(element, translations);
    }
    const previousTranslation = translations.get(attribute);
    if (!originals.has(attribute) || (current !== previousTranslation && current !== originals.get(attribute))) {
      originals.set(attribute, current);
      trackedElements.add(element);
    }
    const original = originals.get(attribute) ?? current;
    if (language === 'PT') {
      if (current !== original) element.setAttribute(attribute, original);
      continue;
    }
    if (current === previousTranslation) continue;
    try {
      const translated = await translateText(original);
      if (document.documentElement.lang === 'en' && element.isConnected) {
        translations.set(attribute, translated);
        element.setAttribute(attribute, translated);
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Falha na tradução automática.');
    }
  }
}

function processRoot(root: Node, language: Language, onError: (message: string) => void) {
  if (root.nodeType === Node.TEXT_NODE) void translateTextNode(root as Text, language, onError);
  if (root.nodeType === Node.ELEMENT_NODE) void translateAttributes(root as Element, language, onError);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let node = walker.nextNode();
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) void translateTextNode(node as Text, language, onError);
    else void translateAttributes(node as Element, language, onError);
    node = walker.nextNode();
  }
}

export function activateAutomaticTranslation(language: Language, onError: (message: string) => void) {
  document.documentElement.lang = language === 'EN' ? 'en' : 'pt-MZ';
  if (language === 'PT') {
    document.title = originalDocumentTitle;
    trackedTexts.forEach((node) => {
      const original = textOriginals.get(node);
      if (original !== undefined && node.isConnected) node.nodeValue = original;
    });
    trackedElements.forEach((element) => {
      attributeOriginals.get(element)?.forEach((value, attribute) => {
        if (element.isConnected) element.setAttribute(attribute, value);
      });
    });
  } else {
    void translateText(originalDocumentTitle)
      .then((title) => { if (document.documentElement.lang === 'en') document.title = title; })
      .catch((error) => onError(error instanceof Error ? error.message : 'Falha na tradução automática.'));
    processRoot(document.body, language, onError);
  }

  let timer = 0;
  const observer = new MutationObserver((mutations) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'characterData') processRoot(mutation.target, language, onError);
        mutation.addedNodes.forEach((node) => processRoot(node, language, onError));
        if (mutation.type === 'attributes') processRoot(mutation.target, language, onError);
      });
    }, 40);
  });
  observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: [...ATTRIBUTES] });
  return () => {
    observer.disconnect();
    window.clearTimeout(timer);
  };
}
