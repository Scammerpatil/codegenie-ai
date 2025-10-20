import { app, BrowserWindow, systemPreferences } from "electron";
import serve from "electron-serve";
import path from "path";
import { fileURLToPath } from "url";

// Emulate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appServe = app.isPackaged
  ? serve({
      directory: path.join(__dirname, "../out"),
    })
  : null;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.ts"),
    },
  });

  systemPreferences.getMediaAccessStatus("microphone");

  win.webContents.on("did-navigate", (event, newUrl) => {
    console.log("Navigated to:", newUrl);
  });

  win.webContents.on("did-navigate-in-page", (event, newUrl) => {
    console.log("In-page navigation:", newUrl);
  });

  if (app.isPackaged) {
    appServe!(win).then(() => {
      win.loadURL("app://-");
    });
  } else {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
    win.webContents.on("did-fail-load", () => {
      win.webContents.reloadIgnoringCache();
    });
  }
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
