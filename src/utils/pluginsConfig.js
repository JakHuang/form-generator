const CDN = 'https://lib.baomitu.com/'

function splicingPluginUrl(PluginName, version, fileName) {
  return `${CDN}${PluginName}/${version}/${fileName}`
}

export default {
  beautifierUrl: splicingPluginUrl('js-beautify', '1.13.5', 'beautifier.min.js'),
  monacoEditorUrl: splicingPluginUrl('monaco-editor', '0.19.3', 'min/vs'),
  tinymceUrl: splicingPluginUrl('tinymce', '5.3.2', 'tinymce.min.js')
}
