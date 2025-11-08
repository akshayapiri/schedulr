import React from 'react'

export default function Header({ theme, toggleTheme, onAddClass, onExport, onImport }) {
  const themeIcon = theme === 'dark' ? 'light_mode' : 'dark_mode'

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1 className="app-title">Schedulr</h1>

          <div className="header-actions">
            <button className="btn btn-primary btn-with-icon" onClick={onAddClass} type="button">
              <span className="material-symbols-rounded" aria-hidden="true">add</span>
              <span className="btn-label">Add Class</span>
            </button>

            <label className="btn btn-secondary btn-with-icon" htmlFor="importFile">
              <span className="material-symbols-rounded" aria-hidden="true">file_upload</span>
              <span className="btn-label">Import JSON</span>
              <input
                id="importFile"
                type="file"
                accept=".json"
                onChange={onImport}
                style={{ display: 'none' }}
              />
            </label>

            <button className="btn btn-secondary btn-with-icon" onClick={onExport} type="button">
              <span className="material-symbols-rounded" aria-hidden="true">file_download</span>
              <span className="btn-label">Export JSON</span>
            </button>

            <button
              className="btn btn-theme btn-icon-only"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              type="button"
            >
              <span className="material-symbols-rounded" aria-hidden="true">{themeIcon}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
