import path from 'path'
import { app, ipcMain, Menu } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import {
  getYoutubeInfo,
  downloadYoutubeMp4,
  downloadYoutubeMp3
} from './utils'
const os = require('os')

const isProd = process.env.NODE_ENV === 'production'

const currentSystem = os.platform()
if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

; (async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  let currentSystemDownloadPath
  let studentPhotoDirPath
  // 如果是 mac 和 linux 時和 windows 是不一樣的
  if (currentSystem === 'darwin' || currentSystem === 'linux') {
    currentSystemDownloadPath = os.homedir() + '/' + 'Downloads/'
    studentPhotoDirPath = currentSystemDownloadPath + 'student/'

  } else if (currentSystem === 'win32') {
    currentSystemDownloadPath = os.homedir() + '\\' + 'Downloads\\'
    studentPhotoDirPath = currentSystemDownloadPath + 'student\\'
  }


  ipcMain.handle('get-youtube-info', async (event, { url }) => {
    console.log('get-youtube-info: ' + url)
    const res = await getYoutubeInfo(url)
    return res
  })

  ipcMain.handle('download-youtube-mp4', async (event, { quality, videoQuality }) => {
    const res = await downloadYoutubeMp4(quality, videoQuality, currentSystemDownloadPath)
    console.log('res: ', res)

    return res
  })

  ipcMain.handle('download-youtube-mp3', async (event, { url }) => {
    const res = await downloadYoutubeMp3(currentSystemDownloadPath, url)
    console.log('res: ', res)
    return res
  })
  Menu.setApplicationMenu(Menu.buildFromTemplate(
    [
      {
        label: 'SQN-YTD',
        submenu: [
          {
            label: '重載當前頁面',
            role: 'reload'
          },
          {
            label: '強制重載當前頁面',
            role: 'forceReload'
          },
          {
            label: '程式碼頁面',
            role: 'toggleDevTools'
          },
          {
            label: '全屏',
            role: 'togglefullscreen'
          },
          {
            label: '摺埋個App',
            role: 'minimize'
          },
          {
            label: '退出',
            click() {
              // 退出程序
              app.quit()
            }
          }
        ]
      },
      {
        label: '&Edit',
        submenu: [
          { label: '複製', role: 'copy' },
          { label: '粘貼', role: 'paste' },
          { label: '剪下', role: 'cut' },
          { label: '全選', role: 'selectAll' },
          { label: '刪除', role: 'delete' }
        ]
      }
    ]
  ))
  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }

})()

app.on('window-all-closed', () => {
  app.quit()
})