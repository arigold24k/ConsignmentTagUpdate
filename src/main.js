// //handle setupevents as quickly as possible
// const setupEvents = require('./installers/setupEvents');
// if (setupEvents.handleSquirrelEvent()) {
//     // squirrel event handled and app will exit in 1000ms, so don't do anything else
//     return;
// };

const {app, BrowserWindow, ipcMain, Menu} = require('electron');
const url = require('url');
const path = require('path');
var mainwindow;
var tagWin;

process.env.NODE_ENV = 'production';

tagWindow =  (cb) =>{
        tagWin = new BrowserWindow({
            width: 800,
            height: 600,
            title: 'Invoice Consignment Orders',
            webPreferences: {
                nodeIntegration: true
            }

        });

        tagWin.loadURL(url.format({
            pathname: path.join(__dirname, '/pages/taglist.html'),
            protocol: 'file:',
            slashes: true
        }));

let intervalHolder;

    tagWin.on('closed', () => {
            mainwindow.webContents.send('update:refresh')
        });
       // tagWin.on('closed', () =>{
    //   tagWin = null;
//
//            intervalHolder = setInterval(() => {mainwindow.reload()}, 2000);
//                setTimeout(()=>{clearInterval(intervalHolder)}, 6001);

//        });

    cb(null, tagWin);

};


POwindow = () =>{
    let poWin = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'PO Number',
        webPreferences: {
            nodeIntegration: true
        }

    });

    poWin.loadURL(url.format({
        pathname: path.join(__dirname, '/pages/ponum.html'),
        protocol: 'file:',
        slashes: true
    }));

    poWin.on('closed', () =>{
        poWin = null;
    })
};

createMainWindow = (v_menu) => {
    mainwindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainwindow.loadURL(url.format({
        pathname: path.join(__dirname, '/pages/index.html'),
        protocol: 'file:',
        slashes: true
    }));
    //want to close all windows
    mainwindow.on('closed', () => {
        app.quit();
    });

    //build menu from template
    const mainMenu = Menu.buildFromTemplate(v_menu);
    //insert menu

    Menu.setApplicationMenu(mainMenu);
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.index.html
// Some APIs can only be used after this event occurs.
app.on('ready', ()=>{
    createMainWindow(mainMenuTemplate);
});


// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow(mainMenuTemplate);
    }
});

//catch tag add
ipcMain.on('update:tags', async (e, res) => {
    console.log(`Hitting the main.js page, data is ${res}`);
    await tagWindow( (err, window) => {
        setTimeout(() => {
            window.webContents.send('update:tags', res);
        }, 1500);
    });
    // tagWin.webContents.send('update:tags', res);



    //tagWin.close();
});

//create menu templaet
const mainMenuTemplate = [
    {
        label: 'File',
        submenu:[
            {
                label: 'Refresh',
                click(){
                    //importing tag window
                    // tagWindow();
                    //var tagWindow = require('./assets/windows/tagWindow')(BrowserWindow, path,url);
                    mainwindow.webContents.send('update:refresh');
                }
            },
            // {
            //     label: 'Update Consignment PO',
            //     click(){
            //         POwindow();
            //         //var poWindow = require('./assets/windows/poWindow')(BrowserWindow, path,url);
            //     }
            // },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q': 'Ctrl+Q', //Acceloretor adds hot keys
                click(){
                    app.quit();
                }
            }

        ]
    }
];
// if mac add empty object to menu
if(process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

//add development tools item if not in production
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I': 'Ctrl+I', //Acceloretor adds hot keys
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]})
}
