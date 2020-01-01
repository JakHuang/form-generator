import { exportDefault, titleCase } from "@/utils/index"
import { isArray } from "util"
import { trigger } from "./config"

var units = {
  KB: '1024',
  MB: '1024 / 1024',
  GB: '1024 / 1024 / 1024'
},
confGlobal,
inheritAttrs = {
  file: '',
  dialog: 'inheritAttrs: false,'
}


export function makeUpJs (conf, type) {
  confGlobal = conf = JSON.parse(JSON.stringify(conf))
  var dataList = [], ruleList = [], optionsList = [], props='', methodList = mixinMethod(type), uploadVar=''

  conf.fields.forEach(el => {
    dataList.push(buildData(el))
    ruleList.push(buildRules(el))

    if(el.options && el.options.length) {
      optionsList.push(buildOptions(el))
      if(el.dataType === 'dynamic') {
        let model = `${el.vModel}Options`,
          options = titleCase(model)
        methodList.push(buildOptionMethod(`get${options}`, model))
      }
    }

    if(el.props && el.props.props) {
      props = buildProps(el)
    }

    if(el.action && el.tag === 'el-upload') {
      uploadVar = `${el.vModel}Action: '${el.action}',
      ${el.vModel}fileList: [],`
      methodList.push(buildBeforeUpload(el))
      if(!el['auto-upload']){
        methodList.push(buildSubmitUpload(el))
      }
    }
  })

  let script = buildexport(conf, type, dataList.join('\n'), ruleList.join('\n'), optionsList.join('\n'), uploadVar, props, methodList.join('\n'))
  confGlobal = null
  return script
}

function mixinMethod(type) {
  var list = [], minxins = {
    file: confGlobal.formBtns ? {
      submitForm: `submitForm() {
        this.$refs['${confGlobal.formRef}'].validate(valid => {
          if(!valid) return
          // TODO 提交表单
        })
      },`,
      resetForm: `resetForm() {
        this.$refs['${confGlobal.formRef}'].resetFields()
      },`
    } : null,
    dialog: {
      onOpen: `onOpen() {},`,
      onClose: `onClose() {
        this.$refs['${confGlobal.formRef}'].resetFields()
      },`,
      close: `close() {
        this.$emit('update:visible', false)
      },`,
      handelConfirm: `handelConfirm() {
        this.$refs['${confGlobal.formRef}'].validate(valid => {
          if(!valid) return
          this.close()
        })
      },`
    }
  }

  let methods = minxins[type]
  if(methods) {
    Object.keys(methods).forEach(key => {
      list.push(methods[key])
    })
  }

  return list
}

function buildData (conf) {
  var defaultValue
  if(typeof(conf.defaultValue) === 'string' && !conf.multiple) {
    defaultValue = `'${conf.defaultValue}'`
  } else {
    defaultValue = `${JSON.stringify(conf.defaultValue)}`
  }

  return `${conf.vModel}: ${ defaultValue },`
}

function buildRules (conf) {
  var rules = []
  if(trigger[conf.tag]) {
    if(conf.required) {
      let type = isArray(conf.defaultValue) ? `type: 'array',` : ''
      let message = isArray(conf.defaultValue) ? '请至少选择一个' + conf.vModel : conf.placeholder
      if(message === undefined) message = conf.label + '不能为空'
      rules.push(`{ required: true, ${type} message: '${message}', trigger: '${trigger[conf.tag]}' }`)
    }
    if(conf.regList && isArray(conf.regList)) {
      conf.regList.forEach(item => {
        if(item.pattern)
          rules.push(`{ pattern: ${eval(item.pattern)}, message: '${item.message}', trigger: '${trigger[conf.tag]}' }`)
      })
    }
    return conf.vModel + ': ['+ rules.join(',') +'],'
  } else {
    return ''
  }
}

function buildOptions(conf) {
  if(conf.dataType === 'dynamic')
    conf.options = []
  let str = `${conf.vModel}Options: ${JSON.stringify(conf.options)},`
  return str
}

function buildProps(conf) {
  if(conf.dataType === 'dynamic') {
    conf.valueKey !== 'value' && (conf.props.props.value = conf.valueKey)
    conf.labelKey !== 'label' && (conf.props.props.label = conf.labelKey)
    conf.childrenKey !== 'children' && (conf.props.props.children = conf.childrenKey)
  }
  let str = `${conf.vModel}Props: ${JSON.stringify(conf.props.props)},`
  return str
}

function buildBeforeUpload(conf) {
  var unitNum = units[conf.sizeUnit], rightSizeCode = '', acceptCode = '', returnList = []
  if(conf.fileSize) {
    rightSizeCode = `let isRightSize = file.size / ${unitNum} < ${conf.fileSize}
    if(!isRightSize){
      this.$message.error('文件大小超过 ${conf.fileSize}${conf.sizeUnit}')
    }`
    returnList.push('isRightSize')
  }
  if(conf.accept) {
    acceptCode = `let isAccept = new RegExp('${conf.accept}').test(file.type)
    if(!isAccept){
      this.$message.error('应该选择${conf.accept}类型的文件')
    }`
    returnList.push('isAccept')
  }
  var str =
  `beforeUpload(file) {
    ${rightSizeCode}
    ${acceptCode}
    return ${returnList.join('&&')}
  },`
  return returnList.length ? str : ''
}

function buildSubmitUpload(conf) {
  var str =
  `submitUpload() {
    this.$refs['${conf.vModel}'].submit()
  },`
  return str
}

function buildOptionMethod(methodName, model) {
  var str = `${methodName}() {
    // TODO 发起请求获取数据
    this.${model}
  },`
  return str
}

function buildexport(conf, type, data, rules, selectOptions, uploadVar, props, methods) {
  var str =
`${exportDefault}{
  ${inheritAttrs[type]}
  components: {},
  props: [],
  data () {
    return {
      ${conf.formModel}: {
        ${data}
      },
      ${conf.formRules}: {
        ${rules}
      },
      ${uploadVar}
      ${selectOptions}
      ${props}
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    ${methods}
  }
}`
  return str
}
