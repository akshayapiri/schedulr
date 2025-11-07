const DEV_ENTRY = '/src/main.jsx'
const MANIFEST_PATH = '/manifest.json'

async function loadDev() {
  await import(DEV_ENTRY)
}

async function loadProd() {
  const manifest = await fetch(MANIFEST_PATH).then((res) => {
    if (!res.ok) throw new Error('Manifest not found')
    return res.json()
  })

  const entry = manifest['src/main.jsx']
  if (!entry || !entry.file) {
    throw new Error('Entry not found in manifest')
  }

  if (entry.css) {
    entry.css.forEach((cssFile) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = `/${cssFile}`
      document.head.appendChild(link)
    })
  }

  const entryUrl = entry.file.startsWith('/') ? entry.file : `/${entry.file}`
  await import(/* @vite-ignore */ entryUrl)
}

;(async () => {
  try {
    await loadDev()
  } catch (error) {
    await loadProd()
  }
})()
