<script>
import render from '@/components/render.js'
import { trigger } from '@/components/generator/config.js'

function renderFrom(h) {
  const { formConfCopy, drawingListCopy } = this
  return (
    <el-row gutter={formConfCopy.gutter}>
      <el-form
        size={formConfCopy.size}
        label-position={formConfCopy.labelPosition}
        disabled={formConfCopy.disabled}
        label-width={`${formConfCopy.labelWidth}px`}
        ref={formConfCopy.formRef}
        // model不能直接赋值 https://github.com/vuejs/jsx/issues/49#issuecomment-472013664
        props={{ model: this[formConfCopy.formModel] }}
        rules={this[formConfCopy.formRules]}
      >
        {renderFormItem.call(this, h, drawingListCopy)}
        {formConfCopy.formBtns && formBtns.call(this, h)}
      </el-form>
    </el-row>
  )
}

function formBtns(h) {
  return <el-col>
    <el-form-item size="large">
      <el-button type="primary" onClick={this.submitForm}>提交</el-button>
      <el-button onClick={this.resetForm}>重置</el-button>
    </el-form-item>
  </el-col>
}

function renderFormItem(h, elementList) {
  return elementList.map(element => {
    const config = element.__config__
    const layout = layouts[config.layout]

    if (layout) {
      return layout.call(this, h, element)
    }
    throw new Error(`没有与${config.layout}匹配的layout`)
  })
}

function renderChildren(h, element) {
  const config = element.__config__
  if (!Array.isArray(config.children)) return null
  return renderFormItem.call(this, h, config.children)
}

const layouts = {
  colFormItem(h, element) {
    const config = element.__config__
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
    if (config.showLabel === false) labelWidth = '0'
    return (
      <el-col span={config.span}>
        <el-form-item label-width={labelWidth} prop={element.__vModel__}
          label={config.showLabel ? config.label : ''}>
          <render conf={element} onInput={ event => {
            this.$set(config, 'defaultValue', event)
            this.$set(this[this.formConf.formModel], element.__vModel__, event)
          }} />
        </el-form-item>
      </el-col>
    )
  },
  rowFormItem(h, element) {
    let child = renderChildren.apply(this, arguments)
    if (element.type === 'flex') {
      child = <el-row type={element.type} justify={element.justify} align={element.align}>
              {child}
            </el-row>
    }
    return (
      <el-col span={element.span}>
        <el-row gutter={element.gutter}>
          {child}
        </el-row>
      </el-col>
    )
  }
}

export default {
  components: {
    render
  },
  props: {
    formConf: {
      type: Object,
      required: true
    },
    drawingList: {
      type: Array,
      required: true
    }
  },
  data() {
    const data = {
      formConfCopy: JSON.parse(JSON.stringify(this.formConf)),
      drawingListCopy: JSON.parse(JSON.stringify(this.drawingList))
    }
    this.initFormData(data, data.drawingListCopy, {})
    this.buildRules(data, data.drawingListCopy, {})
    return data
  },
  methods: {
    initFormData(data, componentList, initData) {
      data[this.formConf.formModel] = componentList.reduce((prev, cur) => {
        const config = cur.__config__
        if (cur.__vModel__) prev[cur.__vModel__] = config.defaultValue
        if (config.children) this.initFormData(data, config.children, prev)
        return prev
      }, initData)
    },
    buildRules(data, componentList, initData) {
      data[this.formConf.formRules] = componentList.reduce((prev, cur) => {
        const config = cur.__config__
        if (Array.isArray(config.regList)) {
          if (config.required) {
            const required = { required: config.required, message: cur.placeholder }
            if (Array.isArray(config.defaultValue)) {
              required.type = 'array'
              required.message = `请至少选择一个${config.label}`
            }
            required.message === undefined && (required.message = `${config.label}不能为空`)
            config.regList.push(required)
          }
          prev[cur.__vModel__] = config.regList.map(item => {
            item.pattern && (item.pattern = eval(item.pattern))
            item.trigger = trigger[config.tag]
            return item
          })
        }
        if (config.children) this.buildRules(data, config.children, prev)
        return prev
      }, initData)
    },
    resetForm() {
      this.drawingListCopy = JSON.parse(JSON.stringify(this.drawingList))
      this.initFormData(this, this.drawingListCopy, {})
      this.$refs[this.formConf.formRef].resetFields()
    },
    submitForm() {
      this.$refs[this.formConf.formRef].validate(valid => {
        if (!valid) return false
        // TODO 提交表单
        console.log('表单结果：', this[this.formConf.formModel])
        return true
      })
    }
  },
  render(h) {
    return renderFrom.call(this, h)
  }
}
</script>
