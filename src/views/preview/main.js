import Vue from 'vue'
let $previewApp = document.getElementById('previewApp')

window.addEventListener('message', init, false)

function init(event) {
  if(event.data.type === 'refreshFrame'){
    let code = event.data.data,
      main = eval("(" + code.js + ")")

    $previewApp.innerHTML = `<style>${code.css}</style><div id="app"></div>`
    Vue.nextTick(function() {
      main.template = `<div>${code.html}</div>`
      new Vue(main).$mount('#app')
    })
  }
}
