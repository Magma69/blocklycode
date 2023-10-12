const { app, BrowserWindow } = require('electron')
const WebSocketServer = require('ws');
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    icon: './icons/favicon.png',
    frame: false,
  })
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})



const wss = new WebSocketServer.Server({ port: 8080 })
 
wss.on("connection", ws => {
    console.log("new client connected");
 
    ws.send('Welcome, you are connected!');
 
    ws.on("message", data => {
        //Looks at the message content
        console.log(`Client has sent us: ${data}`)

    });
 
    ws.on("close", () => {
        console.log("the client has disconnected");
        ws.send('A User has disconnected from the server!')
    });
    ws.onerror = function () {
        console.log("Some Error occurred")
    }
});
console.log("The WebSocket server is running on port 8080");