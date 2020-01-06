import Vue from 'vue'
let $previewApp = document.getElementById('previewApp'),
childAttrs = {
  file: '',
  dialog: ` class="dialog-width" v-if="visible" :visible.sync="visible" :modal-append-to-body="false" `
},
dialogWidth = `<style>.dialog-width .el-dialog{ width: 90%; max-width: 666px; }</style>`

window.addEventListener('message', init, false)

function init(event) {
  if(event.data.type === 'refreshFrame'){
    let code = event.data.data,
      main = eval("(" + code.js + ")"),
      attrs = childAttrs[code.generateConf.type]

    $previewApp.innerHTML = `<style>${code.css}</style>${dialogWidth}<div id="app"></div>`
    main.template = `<div>${code.html}</div>`
    new Vue({
      template: `<div id="${+new Date()}"><child ${attrs}/></div>`,
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
