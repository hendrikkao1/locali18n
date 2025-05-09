import { createContext, ReactNode, useCallback, useContext, use } from "react";
import { I18n } from "@repo/i18n";

const promiseCache = new Map<string, Promise<unknown>>();

const createCachedPromise = <T,>(key: string, promiseFactory: () => Promise<T>): Promise<T> => {
  if (!promiseCache.has(key)) {
    promiseCache.set(key, promiseFactory());
  }

  return promiseCache.get(key) as Promise<T>;
}

const i18nPromise = (config: { sourceLanguage: string; targetLanguage: string }) => {
  const key = `${config.sourceLanguage}:${config.targetLanguage}`;

  return createCachedPromise(key, () => I18n.create(config));
};

const createTranslationPromise = (i18n: I18n, input: string) => {
  const key = `${i18n.sourceLanguage}:${i18n.targetLanguage}:${input}`;

  return createCachedPromise(key, () => i18n.translate(input));
};

const Locali18nContext = createContext<I18n | undefined>(undefined);

interface TranslatorProviderProps {
  children: ReactNode;
  sourceLanguage: string;
  targetLanguage: string;
}

export const Locali18nProvider = ({
  children,
  sourceLanguage,
  targetLanguage,
}: TranslatorProviderProps) => {
  const promise = i18nPromise({ sourceLanguage, targetLanguage });
  const i18n = use(promise);

  return (
    <Locali18nContext.Provider value={i18n}>
      {children}
    </Locali18nContext.Provider>
  );
}

type TooMuchFun = (text: string | number) => string;

export const useTranslation = (): TooMuchFun => {
  const i18n = useContext(Locali18nContext);

  if (!i18n) {
    throw new Error("useTranslation must be used within a Locali18nProvider");
  }

  const t = useCallback((...params: Parameters<TooMuchFun>) => {
    const [text] = params;
    const translationPromise = createTranslationPromise(i18n, text.toString());
    const translation = use(translationPromise)

    return translation;
  }, [i18n]);

  return t;
}

interface TranslationProps {
  children: (t: TooMuchFun) => ReactNode;
}

export const Translation = ({ children }: TranslationProps) => {
  const t = useTranslation();

  return children(t);
}
