/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_AUTHOR: string;
  readonly VITE_APP_URL: string;
  readonly VITE_APP_API_URL: string;
  readonly VITE_APP_THEME: string;
  readonly VITE_APP_LANGUAGE: string;
  readonly VITE_APP_CURRENCY: string;
  readonly VITE_APP_CURRENCY_SYMBOL: string;
  readonly VITE_APP_CURRENCY_DECIMAL_SEPARATOR: string;
  readonly VITE_APP_CURRENCY_THOUSAND_SEPARATOR: string;
  readonly VITE_APP_CURRENCY_DECIMAL_PLACES: string;
  readonly VITE_APP_DATE_FORMAT: string;
  readonly VITE_APP_TIME_FORMAT: string;
  readonly VITE_APP_TIMEZONE: string;
  readonly VITE_APP_LOCALE: string;
  readonly VITE_APP_FALLBACK_LOCALE: string;
  readonly VITE_APP_FALLBACK_LANGUAGE: string;
  readonly VITE_APP_FALLBACK_CURRENCY: string;
  readonly VITE_APP_FALLBACK_CURRENCY_SYMBOL: string;
  readonly VITE_APP_FALLBACK_CURRENCY_DECIMAL_SEPARATOR: string;
  readonly VITE_APP_FALLBACK_CURRENCY_THOUSAND_SEPARATOR: string;
  readonly VITE_APP_FALLBACK_CURRENCY_DECIMAL_PLACES: string;
  readonly VITE_APP_FALLBACK_DATE_FORMAT: string;
  readonly VITE_APP_FALLBACK_TIME_FORMAT: string;
  readonly VITE_APP_FALLBACK_TIMEZONE: string;
  readonly VITE_APP_FALLBACK_LOCALE: string;
  readonly VITE_APP_ENV: string;
  readonly VITE_APP_DEBUG: string;
  readonly VITE_APP_LOG_LEVEL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
