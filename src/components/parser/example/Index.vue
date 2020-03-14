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
        formBtns: true
      },
      drawingList: [
        {
          layout: 'colFormItem',
          tagIcon: 'input',
          label: '手机号',
          vModel: 'mobile',
          formId: 6,
          tag: 'el-input',
          placeholder: '请输入手机号',
          defaultValue: '',
          span: 24,
          showLabel: true,
          labelWidth: null,
          style: { width: '100%' },
          clearable: true,
          prepend: '',
          append: '',
          'prefix-icon': 'el-icon-mobile',
          'suffix-icon': '',
          maxlength: 11,
          'show-word-limit': true,
          readonly: false,
          disabled: false,
          required: true,
          changeTag: true,
          regList: [
            { pattern: '/^1(3|4|5|7|8|9)\\d{9}$/', message: '手机号格式错误' }
          ],
          document: 'https://element.eleme.cn/#/zh-CN/component/input'
        },
        {
          label: '时间选择',
          tag: 'el-time-picker',
          tagIcon: 'time',
          placeholder: '请选择时间选择',
          defaultValue: null,
          span: 24,
          showLabel: true,
          labelWidth: null,
          style: { width: '100%' },
          disabled: false,
          clearable: true,
          required: true,
          'picker-options': { selectableRange: '00:00:00-23:59:59' },
          format: 'HH:mm:ss',
          'value-format': 'HH:mm:ss',
          regList: [],
          changeTag: true,
          document: 'https://element.eleme.cn/#/zh-CN/component/time-picker',
          formId: 101,
          renderKey: 1584181245491,
          layout: 'colFormItem',
          vModel: 'field101'
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
