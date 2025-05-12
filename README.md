# locali18n

A lightweight i18n library for React that uses your browser's Web Machine Learning Translation API for instant translations.

> **Note:** This project is in early development and uses the experimental Web ML Translation API, which has limited browser support and needs a flag enabled.

## Overview

locali18n brings a fresh approach to web app translations by using your browser's built-in translation capabilities. Instead of pre-loading translation files, locali18n translates your content in real-time.

Traditional i18n solutions come with headaches: managing translation files, creating templates, handling dynamic keys, and complex localization processes. locali18n solves these problems with:

- **Real-time Translation**: Content translates without dev cycles or human translators
- **API-friendly**: Dynamic content translates automatically without needing mapped translation keys
- **Zero Maintenance**: No more managing language files and mappings
- **User-Centered**: Adapts to each user's language preferences and personal language models

## Install

```shell
npm install @locali18n/i18n-react --save
```

## Usage

Wrap your application with the provider:

```tsx
import { Locali18nProvider } from "@locali18n/i18n-react";

function Root() {
  return (
    <Locali18nProvider sourceLanguage="en" targetLanguage="ja">
      <App />
    </Locali18nProvider>
  );
}
```

Use the `Translation` component:

```tsx
import { Translation } from "@locali18n/i18n-react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((count) => count + 1)}>
      <Translation>{(t) => t(`count is ${count}`)}</Translation>
    </button>
  );
}
```

Or use the hook instead:

```tsx
import { useTranslation } from "@locali18n/i18n-react";

function App() {
  const t = useTranslation();
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((count) => count + 1)}>
      {t(`count is ${count}`)}
    </button>
  );
}
```

## Enable in Chrome

To use these APIs on localhost:

1. Go to `chrome://flags/#prompt-api-for-gemini-nano`
2. Select Enabled
3. Restart Chrome

To check if Gemini Nano is working, open DevTools and type: `await LanguageModel.availability();`. This should return `available`.

## Useful Links

- [Web Machine Learning Translation API](https://github.com/webmachinelearning/translation-api)
- [Web Machine Learning Prompt API](https://github.com/webmachinelearning/prompt-api)
