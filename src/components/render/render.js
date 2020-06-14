import { deepClone } from '@/utils/index'

function vModel(self, dataObject, defaultValue) {
  dataObject.props.value = defaultValue

  dataObject.on.input = val => {
    self.$emit('input', val)
  }
}

const componentChild = {}
/**
 * 将./slots中的文件挂载到对象componentChild上
 * 文件名为key，对应JSON配置中的__config__.tag
 * 文件内容为value，解析JSON配置中的__slot__
 */
const slotsFiles = require.context('./slots', false, /\.js$/)
const keys = slotsFiles.keys() || []
keys.forEach(key => {
  const tag = key.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = slotsFiles(key).default
  componentChild[tag] = value
})

export default {
  render(h) {
    const dataObject = {
      attrs: {},
      props: {},
      nativeOn: {},
      on: {},
      style: {}
    }
    const confClone = deepClone(this.conf)
    const children = []

    // 如果slots文件夹存在与当前tag同名的文件，则执行文件中的代码
    const childObjs = componentChild[confClone.__config__.tag]
    if (childObjs) {
      Object.keys(childObjs).forEach(key => {
        const childFunc = childObjs[key]
        if (confClone.__slot__ && confClone.__slot__[key]) {
          children.push(childFunc(h, confClone, key))
        }
      })
    }

    // 将json表单配置转化为vue render可以识别的 “数据对象（dataObject）”
    Object.keys(confClone).forEach(key => {
      const val = confClone[key]
      if (key === '__vModel__') {
        vModel(this, dataObject, confClone.__config__.defaultValue)
      } else if (dataObject[key]) {
        dataObject[key] = { ...dataObject[key], ...val }
      } else {
        dataObject.attrs[key] = val
      }
    })

    // 清理属性
    delete dataObject.attrs.__config__
    delete dataObject.attrs.__slot__

    return h(this.conf.__config__.tag, dataObject, children)
  },
  props: ['conf']
}
