const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const axios = require('axios');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Enable Node.js integration
      contextIsolation: false, // Disable context isolation for easier access to Node.js
      preload: path.join(__dirname, 'src/preload.js'), // Use preload script if needed
    },
  });

  // Load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'src/index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// IPC handler for getting weather data
ipcMain.handle('get-weather', async (event, city) => {
  const apiKey = '32804b24a847407391c53709241010'; // Replace with your actual API key
  try {
    const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow();

  // On macOS, it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});