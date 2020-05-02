import loadScript from './loadScript'
import ELEMENT from 'element-ui'

let beautifierObj

export default function loadBeautifier(cb) {
  if (beautifierObj) {
    cb(beautifierObj)
    return
  }

  const loading = ELEMENT.Loading.service({
    fullscreen: true,
    lock: true,
    text: '格式化资源加载中...',
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 0.5)'
  })

  loadScript('https://cdn.bootcss.com/js-beautify/1.10.2/beautifier.min.js', () => {
    loading.close()
    // eslint-disable-next-line no-undef
    beautifierObj = beautifier
    cb(beautifierObj)
  })
}
