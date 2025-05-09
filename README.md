# locali18n

A lightweight i18n library for React that harnesses the browser's Web Machine Learning Translation API for instant, dynamic translations.

> **Note:** This project is in early development (v0.0.1) and relies on the experimental Web ML Translation API, which has limited browser support and requires a flag to be enabled.

## Overview

locali18n takes a new approach to web app internationalization by leveraging your browser's native translation capabilities. Unlike traditional methods locali18n delivers translations during runtime.

Traditional i18n approaches face significant challenges: translation files, templates, dynamic keys, localization processes.

- **Truly Real-time**: Content translates instantly without deployment cycles or human translators
- **API-friendly**: Dynamic content translates automatically without needing translation keys
- **Zero Maintenance**: Eliminate the need to manage language files and translation mappings
- **User-Centered**: Adapts to individual language preferences and personal language models

# Install

```shell
npm install @locali18n/i18n-react --save
```

# Usage

Wrap your application with the provider

```tsx
import { Locali18nProvider } from "@locali18n/i18n-react";

function Root() {
  return (
    <Locali18nProvider sourceLanguage="en" targetLanguage="jp">
      <App />
    </Locali18nProvider>
  );
}
```

Using `Translation` component

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

Or the hook eqvalent

```tsx
import { Translation } from "@locali18n/i18n-react";

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

## Enable feature flag

TODO: Describe how to enable feature flag

## Useful Links

- [Web Machine Learning Translation API](https://github.com/webmachinelearning/translation-api)
- [Web Machine Learning Prompt API](https://github.com/webmachinelearning/prompt-api)
