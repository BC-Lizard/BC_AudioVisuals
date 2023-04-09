const { app, BrowserWindow, screen, ipcMain } = require('electron');
const fs = require('fs')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: screen.getPrimaryDisplay().size.width,
    height: screen.getPrimaryDisplay().size.height,
    autoHideMenuBar: true,
    webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, 'scripts/preload.js')
    }
  });

  // Set Icon
  win.setIcon('favicon.png')

  // Maximize window by default
  win.maximize();
  win.loadFile('index.html');
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});