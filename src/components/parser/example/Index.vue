<template>
  <div class="test-from">
    <parser :form-conf="formConf" :drawing-list="drawingList" />
    <parser :form-conf="formConf" :drawing-list="drawingList" />
  </div>
</template>

<script>
import Parser from '../Parser'

export default {
  components: {
    Parser
  },
  props: {},
  data() {
    return {
      formConf: {
        formRef: 'elForm',
        formModel: 'formData',
        size: 'small',
        labelPosition: 'right',
        labelWidth: 100,
        formRules: 'rules',
        gutter: 15,
        disabled: false,
        span: 24,
        formBtns: true,
        unFocusedComponentBorder: false
      },
      drawingList: [
        {
          __config__: {
            label: '单行文本',
            labelWidth: null,
            showLabel: true,
            changeTag: true,
            tag: 'el-input',
            tagIcon: 'input',
            required: true,
            layout: 'colFormItem',
            span: 24,
            document: 'https://element.eleme.cn/#/zh-CN/component/input',
            regList: [],
            formId: 101,
            renderKey: 1585760329888
          },
          __slot__: {
            prepend: '',
            append: ''
          },
          placeholder: '请输入单行文本',
          style: {
            width: '100%'
          },
          clearable: true,
          'prefix-icon': '',
          'suffix-icon': '',
          maxlength: null,
          'show-word-limit': false,
          readonly: false,
          disabled: false,
          __vModel__: 'field101'
        },
        {
          __config__: {
            label: '日期范围',
            tag: 'el-date-picker',
            tagIcon: 'date-range',
            defaultValue: null,
            span: 24,
            showLabel: true,
            labelWidth: null,
            required: true,
            layout: 'colFormItem',
            regList: [],
            changeTag: true,
            document: 'https://element.eleme.cn/#/zh-CN/component/date-picker',
            formId: 106,
            renderKey: 1585761426650
          },
          style: {
            width: '100%'
          },
          type: 'datetimerange',
          'range-separator': '至',
          'start-placeholder': '开始日期',
          'end-placeholder': '结束日期',
          disabled: false,
          clearable: true,
          format: 'yyyy-MM-dd HH:mm:ss',
          'value-format': 'yyyy-MM-dd HH:mm:ss',
          readonly: false,
          __vModel__: 'field106'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.test-from {
  margin: 15px auto;
  width: 800px;
  padding: 15px;
}
</style>
