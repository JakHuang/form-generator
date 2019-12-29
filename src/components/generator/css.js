let styles = {
  'el-rate': `.el-rate{display: inline-block; vertical-align: text-top;}`,
  'el-upload': `.el-upload__tip{line-height: 1.2;}`
}

export function makeUpCss(conf) {
  let cssList = []
  conf = JSON.parse(JSON.stringify(conf))
  conf.fields.forEach(el => {
    let css = styles[el.tag]
    css && cssList.push(css)
  })

  return cssList.join('\n')
}
