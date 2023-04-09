const { contextBridge } = require('electron');
const path = require('path');

// Expose Node.js `require` function to the renderer process
contextBridge.exposeInMainWorld('require', require);
contextBridge.exposeInMainWorld('__dirname', path.join(__dirname, '..'));
