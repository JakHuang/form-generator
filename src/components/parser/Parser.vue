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
        <el-col>
          <el-form-item size="large">
            <el-button type="primary" onClick={this.submitForm}>提交</el-button>
            <el-button onClick={this.resetForm}>重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  )
}

function renderFormItem(h, elementList) {
  return elementList.map(element => {
    const layout = layouts[element.layout]

    if (layout) {
      return layout.call(this, h, element)
    }
    throw new Error(`没有与${element.layout}匹配的layout`)
  })
}

function renderChildren(h, element) {
  if (!Array.isArray(element.children)) return null
  return renderFormItem.call(this, h, element.children)
}

const layouts = {
  colFormItem(h, element) {
    let labelWidth = element.labelWidth ? `${element.labelWidth}px` : null
    if (element.showLabel === false) labelWidth = '0'
    return (
      <el-col span={element.span}>
        <el-form-item label-width={labelWidth} prop={element.vModel}
          label={element.showLabel ? element.label : ''}>
          <render conf={element} onInput={ event => {
            this.$set(element, 'defaultValue', event)
            this.$set(this[this.formConf.formModel], element.vModel, event)
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

// 构建表单校验规则
function buildRules(data) {
  data[this.formConf.formRules] = this.drawingList.reduce((prev, cur) => {
    const required = { required: true, message: cur.placeholder }
    if (Array.isArray(cur.defaultValue)) {
      required.type = 'array'
      required.message = `请至少选择一个${cur.label}`
    }
    required.message === undefined && (required.message = `${cur.label}不能为空`)
    cur.regList.push(required)
    prev[cur.vModel] = cur.regList.map(item => {
      item.pattern && (item.pattern = eval(item.pattern))
      item.trigger = trigger[cur.tag]
      return item
    })
    return prev
  }, {})
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

    data[this.formConf.formModel] = this.drawingList.reduce((prev, cur) => {
      prev[cur.vModel] = cur.defaultValue
      return prev
    }, {})

    // 表单校验规则
    buildRules.call(this, data)
    return data
  },
  methods: {
    resetForm() {
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
