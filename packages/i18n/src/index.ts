/**
 * Docs ;)
 * https://github.com/webmachinelearning/prompt-api
 * https://github.com/webmachinelearning/translation-api/blob/main/README.md
 */

declare global {
  interface Window {
    ai?: {
      translator?: {
        create(options: I18nOptions): Promise<TranslationSession>;
      };
    };
  }
}

interface I18nOptions {
  sourceLanguage: string;
  targetLanguage: string;
}


interface TranslationSession {
  translate(text: string): Promise<string>;
}

interface TranslationProvider { 
  createSession(options: I18nOptions): Promise<TranslationSession>;
}

class WindowAiTranslatorProvider implements TranslationProvider {
  async createSession(options: I18nOptions): Promise<TranslationSession> {
    if (!window?.ai?.translator?.create) {
      throw new Error(
        "The 'window.ai.translator.create' function is not available. Ensure the browser supports this feature and it's enabled."
      );
    }

    try {
      const session = await window.ai.translator.create({
        sourceLanguage: options.sourceLanguage,
        targetLanguage: options.targetLanguage,
      });

      return session;
    } catch (error) {
      const message = `Failed to create translation session via window.ai for ${options.sourceLanguage} -> ${options.targetLanguage}.`;

      throw new Error(message);
    }
  }
}


export class I18n {
  private cache: Map<string, string> = new Map();

  private options: I18nOptions;

  private provider: TranslationProvider;

  private session: TranslationSession | undefined;
  
  private constructor(options: I18nOptions, provider: TranslationProvider) {
    this.options = options;
    this.provider = provider;
  }
  
  get sourceLanguage() {
    return this.options.sourceLanguage;
  }

  get targetLanguage() {
    return this.options.targetLanguage;
  }

  static async create(
    options: I18nOptions,
    provider: TranslationProvider = new WindowAiTranslatorProvider()
  ): Promise<I18n> {
    const instance = new I18n(options, provider);

    await instance.initialize();

    return instance;
  }

  private async initialize(): Promise<void> {
    try {
      this.session = await this.provider.createSession(this.options);
    } catch (error) {
      const message = `Failed to initialize the translation session for ${this.sourceLanguage} -> ${this.targetLanguage}.`;

      throw new Error(message);
    }
  }

  async translate(input: string): Promise<string> {
    if (!this.session) {
      throw new Error(
        "Service not initialized. The translation session is unavailable. Ensure '.create()' completed successfully before calling '.translate()'."
      );
    }

    const cacheKey = `${this.sourceLanguage}:${this.targetLanguage}:${input}`;

    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // If not in cache, perform translation using the active session
    try {
      const translated = await this.session.translate(input);

      // Store successful translation in cache using the original input as part of the key
      this.cache.set(cacheKey, translated);

      return translated;
    } catch (error) {
      const message = `Failed to translate text starting with "${input.substring(0, 30)}..." from ${this.sourceLanguage} to ${this.targetLanguage}.`;

      throw new Error(message);
    }
  }
}
