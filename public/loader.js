const DEV_ENTRY = '/src/main.jsx'
const PROD_JS = '/assets/app.js'
const PROD_CSS = '/assets/app.css'

async function loadDev() {
  await import(DEV_ENTRY)
}

async function loadProd() {
  const cssLink = document.createElement('link')
  cssLink.rel = 'stylesheet'
  cssLink.href = PROD_CSS
  cssLink.onerror = () => {
    console.warn('CSS bundle not found, continuing without styles')
  }
  document.head.appendChild(cssLink)

  await import(/* @vite-ignore */ PROD_JS)
}

;(async () => {
  try {
    await loadDev()
  } catch (error) {
    await loadProd()
  }
})()
