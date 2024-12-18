const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

const createWindow = () => {
    const window = new BrowserWindow({
        // autoHideMenuBar: true,
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    window.loadURL(
        url.format({
            pathname: path.join(__dirname, "dist/index.html"),
            protocol: "file:",
            slashes: true,
        })
    );

    // window.setFullScreen(true);
};

app.on("ready", () => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
