const { app, BrowserWindow, protocol } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const distPath = path.join(__dirname, "..", "dist", "public");

  // Register a custom protocol to serve files and handle SPA routing
  protocol.handle("app", (request) => {
    const url = new URL(request.url);
    let filePath = path.join(distPath, url.pathname);
    
    // If file doesn't exist, serve index.html (SPA fallback)
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distPath, "index.html");
    }
    
    return new Response(fs.readFileSync(filePath), {
      headers: { "Content-Type": getMimeType(filePath) },
    });
  });

  mainWindow.loadURL("app://./index.html");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".ico": "image/x-icon",
  };
  return types[ext] || "application/octet-stream";
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
