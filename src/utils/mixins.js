export var mixins = {
  methods: {
    openLink(link) {
      window.parent.postMessage({
        cmd: 'openUrl',
        data: {
          url: link
        }
      }, '*')
    }
  }
}