function loadScript(src, callback) {
  const cb = callback || (() => {})
  const $script = document.createElement('script')
  $script.src = src
  $script.id = src
  document.body.appendChild($script)
  const onEnd = 'onload' in $script ? stdOnEnd : ieOnEnd
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

export default loadScript
