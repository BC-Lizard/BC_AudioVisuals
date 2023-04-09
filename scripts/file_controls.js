const fs = require('fs')
const path = require('path')
let mediaPath = document.getElementById('media-path-input')

function fileStartup() {
  mediaPath.value = path.join(__dirname, 'audio')
}

function listFiles() {
  clearList()
  dirPath = mediaPath.value
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.log(err)
    } else {
      const fileList = document.getElementById('file-list');
      files.forEach(file => {
        const div = document.createElement('div')
        div.innerText = file
        div.classList.add('media-title');
        div.setAttribute('onclick', `setFilePathForPlayback("${div.innerText}")`)
        fileList.append(div)
      })
    }
  });
}

function clearList() {
  document.querySelectorAll('.media-title').forEach(elem => elem.remove());
}

function setFilePathForPlayback(filename) {
  if (audioElement != null) {
    audioElement.pause()
  }
  audioElement = new Audio(`${mediaPath.value}/${filename}`);
  // audioContext = null
  playToggle()
}

fileStartup();
listFiles();