const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'src', 'preload.js'), // Use the preload script
            contextIsolation: true, // Enable context isolation for security
            nodeIntegration: false, // Disable Node.js integration
        },
    });

    mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
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

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});