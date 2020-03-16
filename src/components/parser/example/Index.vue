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
          layout: 'rowFormItem',
          tagIcon: 'row',
          type: 'default',
          justify: 'start',
          align: 'top',
          layoutTree: true,
          children: [
            {
              label: '多选框组',
              tag: 'el-checkbox-group',
              tagIcon: 'checkbox',
              defaultValue: [],
              span: 24,
              showLabel: true,
              labelWidth: null,
              style: {},
              optionType: 'default',
              border: false,
              size: 'medium',
              disabled: false,
              required: true,
              options: [
                { label: '选项一', value: 1 },
                { label: '选项二', value: 2 }
              ],
              regList: [],
              changeTag: true,
              document: 'https://element.eleme.cn/#/zh-CN/component/checkbox',
              formId: 107,
              renderKey: 1584200583696,
              layout: 'colFormItem',
              vModel: 'field107'
            }
          ],
          document: 'https://element.eleme.cn/#/zh-CN/component/layout',
          formId: 108,
          span: 24,
          renderKey: 1584203505593,
          componentName: 'row108',
          gutter: 15
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
