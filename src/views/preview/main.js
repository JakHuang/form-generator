import Vue from 'vue'
let $previewApp = document.getElementById('previewApp'),
childAttrs = {
  file: '',
  dialog: ` width="600px" class="dialog-width" v-if="visible" :visible.sync="visible" :modal-append-to-body="false" `
}

window.addEventListener('message', init, false)

function init(event) {
  if(event.data.type === 'refreshFrame'){
    let code = event.data.data,
      main = eval("(" + code.js + ")"),
      attrs = childAttrs[code.generateConf.type]

    $previewApp.innerHTML = `<style>${code.css}</style><div id="app"></div>`
    main.template = `<div>${code.html}</div>`
    new Vue({
      template: `<div><child ${attrs}/></div>`,
      data() {
        return {
          visible: true
        }
      },
      components: {
        child: main
      }
    }).$mount('#app')
  }
}
