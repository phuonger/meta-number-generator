const { app, BrowserWindow, protocol, net } = require("electron");
const path = require("path");
const fs = require("fs");
const url = require("url");

let mainWindow;

const distPath = path.join(__dirname, "..", "dist", "public");

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript",
    ".mjs": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".ico": "image/x-icon",
    ".webp": "image/webp",
  };
  return types[ext] || "application/octet-stream";
}

app.whenReady().then(() => {
  protocol.handle("app", (request) => {
    let pathname = decodeURIComponent(new URL(request.url).pathname);
    
    // Remove leading slash for path resolution
    if (pathname.startsWith("/")) {
      pathname = pathname.substring(1);
    }
    
    // Default to index.html
    if (!pathname || pathname === "" || pathname === "./") {
      pathname = "index.html";
    }
    
    let filePath = path.join(distPath, pathname);
    
    // SPA fallback: if file doesn't exist, serve index.html
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distPath, "index.html");
    }
    
    const data = fs.readFileSync(filePath);
    return new Response(data, {
      status: 200,
      headers: { "Content-Type": getMimeType(filePath) },
    });
  });

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

  mainWindow.loadURL("app://bundle/index.html#/");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    app.whenReady().then(() => {
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
      mainWindow.loadURL("app://bundle/index.html");
    });
  }
});
