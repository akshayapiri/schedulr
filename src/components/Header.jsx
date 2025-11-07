import React from 'react'

export default function Header({ theme, toggleTheme, onAddClass, onExport, onImport }) {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1 className="app-title">Schedulr</h1>

          <div className="header-actions">
            <button className="btn btn-primary" onClick={onAddClass}>
              + Add Class
            </button>

            <label className="btn btn-secondary" htmlFor="importFile">
              Import JSON
              <input
                id="importFile"
                type="file"
                accept=".json"
                onChange={onImport}
                style={{ display: 'none' }}
              />
            </label>

            <button className="btn btn-secondary" onClick={onExport}>
              Export JSON
            </button>

            <button
              className="btn btn-theme"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
