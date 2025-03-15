import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Translation, Locali18nProvider } from '@locali18n/i18n-react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Locali18nProvider sourceLanguage='en' targetLanguage='es'>
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            <Translation>{(t) => {
              return t(`count is ${count}`)
            }}</Translation>
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          <Translation>{(t) => {
            return t("Click on the Vite and React logos to learn more")
          }}</Translation>
        </p>
      </Locali18nProvider>
    </>
  )
}

export default App
