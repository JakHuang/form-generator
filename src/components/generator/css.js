const styles = {
  'el-rate': '.el-rate{display: inline-block; vertical-align: text-top;}',
  'el-upload': '.el-upload__tip{line-height: 1.2;}'
}

export function makeUpCss(conf) {
  const cssList = []
  conf = JSON.parse(JSON.stringify(conf))
  conf.fields.forEach((el) => {
    const css = styles[el.tag]
    css && cssList.indexOf(css) === -1 && cssList.push(css)
  })

  return cssList.join('\n')
}
