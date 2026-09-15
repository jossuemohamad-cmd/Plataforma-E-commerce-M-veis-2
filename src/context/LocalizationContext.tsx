import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Currency, Language } from '../types';
import { activateAutomaticTranslation } from '../lib/automaticPageTranslator';

interface ExchangeRates {
  MZN: number;
  USD?: number;
  EUR?: number;
}

interface LocalizationContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  lang: Language;
  setLang: (language: Language) => void;
  formatPrice: (amountInMZN: number) => string;
  convertFromMzn: (amountInMZN: number) => number;
  convertToMzn: (amount: number) => number;
  getExchangeLabel: (base: Currency, target: Currency) => string;
  ratesLoading: boolean;
  ratesUpdatedAt: Date | null;
  rateError: string | null;
  translationError: string | null;
  t: (key: string, fallback?: string) => string;
}

const RATES_CACHE_KEY = 'eden_exchange_rates_v1';
const TWELVE_HOURS = 12 * 60 * 60 * 1000;
const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

function readCachedRates(): { rates: ExchangeRates; updatedAt: number } | null {
  try {
    const cached = JSON.parse(localStorage.getItem(RATES_CACHE_KEY) || 'null') as { rates?: ExchangeRates; updatedAt?: number } | null;
    if (!cached?.rates?.MZN || !cached.updatedAt) return null;
    return { rates: cached.rates, updatedAt: cached.updatedAt };
  } catch {
    localStorage.removeItem(RATES_CACHE_KEY);
    return null;
  }
}

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('aethel_currency');
    return saved === 'USD' || saved === 'EUR' ? saved : 'MZN';
  });
  const [lang, setLangState] = useState<Language>(() => localStorage.getItem('aethel_lang') === 'EN' ? 'EN' : 'PT');
  const cached = useMemo(readCachedRates, []);
  const [rates, setRates] = useState<ExchangeRates>(cached?.rates ?? { MZN: 1 });
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState<Date | null>(cached ? new Date(cached.updatedAt) : null);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [rateError, setRateError] = useState<string | null>(null);
  const [translationError, setTranslationError] = useState<string | null>(null);

  useEffect(() => {
    const abort = new AbortController();
    const cacheIsFresh = cached && Date.now() - cached.updatedAt < TWELVE_HOURS;
    if (cacheIsFresh) setRatesLoading(false);

    void fetch('https://open.er-api.com/v6/latest/MZN', { signal: abort.signal, headers: { Accept: 'application/json' } })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Serviço cambial indisponível (${response.status}).`);
        const payload = await response.json() as {
          result?: string;
          time_last_update_unix?: number;
          rates?: Record<string, number>;
        };
        if (payload.result !== 'success' || !payload.rates?.USD || !payload.rates?.EUR) {
          throw new Error('O serviço cambial não retornou taxas válidas.');
        }
        const nextRates: ExchangeRates = { MZN: 1, USD: payload.rates.USD, EUR: payload.rates.EUR };
        const updatedAt = (payload.time_last_update_unix ?? Math.floor(Date.now() / 1000)) * 1000;
        setRates(nextRates);
        setRatesUpdatedAt(new Date(updatedAt));
        setRateError(null);
        localStorage.setItem(RATES_CACHE_KEY, JSON.stringify({ rates: nextRates, updatedAt }));
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        if (!cached) setRateError(error instanceof Error ? error.message : 'Não foi possível atualizar as taxas cambiais.');
      })
      .finally(() => setRatesLoading(false));
    return () => abort.abort();
  }, [cached]);

  useEffect(() => {
    setTranslationError(null);
    return activateAutomaticTranslation(lang, setTranslationError);
  }, [lang]);

  const setCurrency = useCallback((nextCurrency: Currency) => {
    setCurrencyState(nextCurrency);
    localStorage.setItem('aethel_currency', nextCurrency);
  }, []);

  const setLang = useCallback((nextLanguage: Language) => {
    setLangState(nextLanguage);
    localStorage.setItem('aethel_lang', nextLanguage);
  }, []);

  const formatPrice = useCallback((amountInMZN: number) => {
    const rate = rates[currency];
    if (!rate) return `— ${currency}`;
    const converted = amountInMZN * rate;
    const value = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: currency === 'MZN' ? 0 : 2,
      maximumFractionDigits: currency === 'MZN' ? 0 : 2
    }).format(converted);
    return `${value} ${currency}`;
  }, [currency, lang, rates]);

  const convertFromMzn = useCallback((amountInMZN: number) => amountInMZN * (rates[currency] ?? 0), [currency, rates]);
  const convertToMzn = useCallback((amount: number) => {
    const rate = rates[currency];
    return rate ? amount / rate : 0;
  }, [currency, rates]);

  const getExchangeLabel = useCallback((base: Currency, target: Currency) => {
    const baseRate = rates[base];
    const targetRate = rates[target];
    if (!baseRate || !targetRate) return `1 ${base} = — ${target}`;
    const value = targetRate / baseRate;
    const digits = value < 0.1 ? 4 : 2;
    return `1 ${base} = ${value.toLocaleString(lang === 'EN' ? 'en-US' : 'pt-MZ', { maximumFractionDigits: digits })} ${target}`;
  }, [lang, rates]);

  const t = useCallback((key: string, fallback?: string) => fallback || key, []);

  return (
    <LocalizationContext.Provider value={{
      currency,
      setCurrency,
      lang,
      setLang,
      formatPrice,
      convertFromMzn,
      convertToMzn,
      getExchangeLabel,
      ratesLoading,
      ratesUpdatedAt,
      rateError,
      translationError,
      t
    }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) throw new Error('useLocalization must be used within LocalizationProvider');
  return context;
}
