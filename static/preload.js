const path = require('path');
const filePath = location.href.replace('file://', '');
const {ipcRenderer, nativeImage, clipboard} = require('electron');
const Store = require('electron-store');
const store = new Store();

function convertImgToBase64(url, callback, outputFormat){
  var canvas = document.createElement('CANVAS'),
    ctx = canvas.getContext('2d'),
    img = new Image;
  img.crossOrigin = 'Anonymous';
  img.onload = function(){
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img,0,0);
    var dataURL = canvas.toDataURL(outputFormat || 'image/png');
    callback.call(this, dataURL);
    canvas = null;
  };
  img.src = url;
}

window.utools = window.rubick = {
  // 事件
  onPluginEnter(cb) {
    ipcRenderer.once('onPluginEnter', (e, message) => {
      const feature = JSON.parse(message.detail)
      cb(feature)
    })
  },
  onPluginReady(cb) {
    ipcRenderer.once('onPluginReady', (e, message) => {
      const feature = JSON.parse(message.detail)
      cb(feature)
    })
  },
  onPluginOut(cb) {
    ipcRenderer.once('onPluginOut', (e, message) => {
      const feature = JSON.parse(message.detail)
      cb(feature)
    })
  },

  // 窗口交互
  hideMainWindow() {
    ipcRenderer.send('msg-trigger', {
      type: 'hideMainWindow',
    });
  },
  showMainWindow() {
    ipcRenderer.send('msg-trigger', {
      type: 'showMainWindow',
    });
  },
  setExpendHeight(height) {
    ipcRenderer.send('msg-trigger', {
      type: 'setExpendHeight',
      height,
    });
  },
  setSubInput(onChange, placeHolder, isFocus) {

  },

  getPath(name) {
    ipcRenderer.send('msg-trigger', {
      type: 'getPath',
      name,
    });
    return new Promise((resolve, reject) => {
      ipcRenderer.once(`msg-back-getPath`, (e, result) => {
        result ? resolve(result) : reject();
      });
    })
  },

  showNotification(body, clickFeatureCode) {
    const myNotification = new Notification('Rubick 通知', {
      body
    });
    return myNotification;
    // todo 实现 clickFeatureCode
  },
  copyImage(img) {
    convertImgToBase64(img,function(base64Image) {
      const image = nativeImage.createFromDataURL(base64Image)
      clipboard.writeImage(image)
    })
  },
  copyText(text) {
    clipboard.writeText(text);
  },
  db: {
    put(key, value) {
      console.log(key, value);
      store.set(key, value)
    },
    get(key) {
      store.get(key);
    },
    remove() {}
  },
  isDarkColors() {
    return false;
  },
}
require(path.join(filePath, '../preload.js'));
