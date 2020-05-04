function vModel(self, dataObject, defaultValue) {
  dataObject.props.value = defaultValue

  dataObject.on.input = val => {
    self.$emit('input', val)
  }
}

const componentChild = {
  'el-input': {
    prepend(h, conf, key) {
      return <template slot="prepend">{conf.__slot__[key]}</template>
    },
    append(h, conf, key) {
      return <template slot="append">{conf.__slot__[key]}</template>
    }
  },
  'el-select': {
    options(h, conf, key) {
      const list = []
      conf.__slot__.options.forEach(item => {
        list.push(<el-option label={item.label} value={item.value} disabled={item.disabled}></el-option>)
      })
      return list
    }
  },
  'el-radio-group': {
    options(h, conf, key) {
      const list = []
      conf.__slot__.options.forEach(item => {
        if (conf.__config__.optionType === 'button') {
          list.push(<el-radio-button label={item.value}>{item.label}</el-radio-button>)
        } else {
          list.push(<el-radio label={item.value} border={conf.border}>{item.label}</el-radio>)
        }
      })
      return list
    }
  },
  'el-checkbox-group': {
    options(h, conf, key) {
      const list = []
      conf.__slot__.options.forEach(item => {
        if (conf.__config__.optionType === 'button') {
          list.push(<el-checkbox-button label={item.value}>{item.label}</el-checkbox-button>)
        } else {
          list.push(<el-checkbox label={item.value} border={conf.border}>{item.label}</el-checkbox>)
        }
      })
      return list
    }
  },
  'el-upload': {
    'list-type': (h, conf, key) => {
      const list = []
      const config = conf.__config__
      if (conf['list-type'] === 'picture-card') {
        list.push(<i class="el-icon-plus"></i>)
      } else {
        list.push(<el-button size="small" type="primary" icon="el-icon-upload">{config.buttonText}</el-button>)
      }
      if (config.showTip) {
        list.push(
          <div slot="tip" class="el-upload__tip">只能上传不超过 {config.fileSize}{config.sizeUnit} 的{conf.accept}文件</div>
        )
      }
      return list
    }
  }
}

export default {
  render(h) {
    const dataObject = {
      attrs: {},
      props: {},
      on: {},
      style: {}
    }
    const confClone = JSON.parse(JSON.stringify(this.conf))
    const children = []

    const childObjs = componentChild[confClone.__config__.tag]
    if (childObjs) {
      Object.keys(childObjs).forEach(key => {
        const childFunc = childObjs[key]
        if (confClone.__slot__ && confClone.__slot__[key]) {
          children.push(childFunc(h, confClone, key))
        }
      })
    }

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
    delete dataObject.attrs.__config__
    delete dataObject.attrs.__slot__
    return h(this.conf.__config__.tag, dataObject, children)
  },
  props: ['conf']
}
