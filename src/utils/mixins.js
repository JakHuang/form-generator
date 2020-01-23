export const mixins = {
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
