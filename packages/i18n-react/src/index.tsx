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

const createTranslationPromise = (translator: I18n, input: string) => {
  const key = `${"sourceLanguage"}:${"targetLanguage"}:${input}`;

  return createCachedPromise(key, () => translator.translate(input));
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

type TooMuchFun = (taxt: string) => string;

export const useTranslation = (): TooMuchFun => {
  const translator = useContext(Locali18nContext);

  if (!translator) {
    throw new Error("useTranslation must be used within a Locali18nProvider");
  }

  const t = useCallback((...params: Parameters<TooMuchFun>) => {
    const [text] = params;
    const translationPromise = createTranslationPromise(translator, text);

    return use(translationPromise);
  }, [translator]);

  return t;
}

interface TranslationProps {
  children: (t: TooMuchFun) => ReactNode;
}

export const Translation = ({ children }: TranslationProps) => {
  const t = useTranslation();

  return children(t);
}
