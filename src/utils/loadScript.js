/**
 * 加载一个远程脚本
 * @param {String} src 一个远程脚本
 * @param {Function} callback 回调
 */
function loadScript(src, callback) {
  const cb = callback || (() => {})
  const $script = document.createElement('script')
  $script.src = src
  $script.id = src
  $script.async = 1
  document.body.appendChild($script)
  const onEnd = 'onload' in $script ? stdOnEnd.bind($script) : ieOnEnd.bind($script)
  onEnd($script)

  function stdOnEnd(script) {
    script.onload = () => {
      this.onerror = this.onload = null
      cb(null, script)
    }
    script.onerror = () => {
      this.onerror = this.onload = null
      cb(new Error(`Failed to load ${src}`), script)
    }
  }

  function ieOnEnd(script) {
    script.onreadystatechange = () => {
      if (this.readyState !== 'complete' && this.readyState !== 'loaded') return
      this.onreadystatechange = null
      cb(null, script)
    }
  }
}

/**
 * 顺序加载一组远程脚本
 * @param {Array} list 一组远程脚本
 * @param {Function} cb 回调
 */
export function loadScriptQueue(list, cb) {
  const first = list.shift()
  list.length ? loadScript(first, () => loadScriptQueue(list, cb)) : loadScript(first, cb)
}

export default loadScript
