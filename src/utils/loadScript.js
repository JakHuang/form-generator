function loadScript(src, callback) {
  const cb = callback || function () {}
  const script = document.createElement('script')
  script.src = src
  script.id = src
  document.body.appendChild(script)
  const onEnd = 'onload' in script ? stdOnEnd : ieOnEnd
  onEnd(script)

  function stdOnEnd(script) {
    script.onload = function () {
      this.onerror = this.onload = null
      cb(null, script)
    }
    script.onerror = function () {
      this.onerror = this.onload = null
      cb(new Error(`Failed to load ${src}`), script)
    }
  }

  function ieOnEnd(script) {
    script.onreadystatechange = function () {
      if (this.readyState !== 'complete' && this.readyState !== 'loaded') return
      this.onreadystatechange = null
      cb(null, script)
    }
  }
}

export default loadScript
