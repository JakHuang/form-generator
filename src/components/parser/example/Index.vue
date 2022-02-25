<template>
  <div class="test-form">
    <parser :form-conf="formConf" @submit="sumbitForm1" />
    <parser :key="key2" :form-conf="formConf" @submit="sumbitForm2" />
    <el-button @click="change">
      change
    </el-button>
  </div>
</template>

<script>
/* eslint-disable func-names */
import Parser from '../Parser'

// 若parser是通过安装npm方式集成到项目中的，使用此行引入
// import Parser from 'form-gen-parser'

const units = {
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024
}

export default {
  components: {
    Parser
  },
  props: {},
  data() {
    return {
      key2: +new Date(),
      formConf: {
        fields: [
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
              regList: [
                {
                  pattern: '/^1(3|4|5|7|8|9)\\d{9}$/',
                  message: '手机号格式错误'
                }
              ]
            },
            __slot__: {
              prepend: '',
              append: ''
            },
            __vModel__: 'mobile',
            placeholder: '请输入手机号',
            style: {
              width: '100%'
            },
            clearable: true,
            'prefix-icon': 'el-icon-mobile',
            'suffix-icon': '',
            maxlength: 11,
            'show-word-limit': true,
            readonly: false,
            disabled: false
          },
          {
            __config__: {
              label: '上传',
              tag: 'el-upload',
              tagIcon: 'upload',
              layout: 'colFormItem',
              defaultValue: null,
              showLabel: true,
              labelWidth: null,
              required: true,
              span: 24,
              showTip: false,
              buttonText: '点击上传',
              regList: [],
              changeTag: true,
              fileSize: 2,
              sizeUnit: 'MB',
              document: 'https://element.eleme.cn/#/zh-CN/component/upload',
              formId: 101,
              renderKey: 1644834179356
            },
            __slot__: {
              'list-type': true
            },
            action: 'https://qcl871.api.cloudendpoint.cn/upload',
            disabled: false,
            accept: 'image/*',
            name: 'file',
            'auto-upload': true,
            'list-type': 'picture-card',
            multiple: false,
            __vModel__: 'imgList'
          },
          {
            __config__: {
              layout: 'rowFormItem',
              tagIcon: 'row',
              label: '行容器',
              layoutTree: true,
              children: [
                {
                  __config__: {
                    label: '评分',
                    tag: 'el-rate',
                    tagIcon: 'rate',
                    defaultValue: 0,
                    span: 24,
                    showLabel: true,
                    labelWidth: null,
                    layout: 'colFormItem',
                    required: true,
                    regList: [],
                    changeTag: true,
                    document: 'https://element.eleme.cn/#/zh-CN/component/rate',
                    formId: 102,
                    renderKey: 1586839671259
                  },
                  style: {},
                  max: 5,
                  'allow-half': false,
                  'show-text': false,
                  'show-score': false,
                  disabled: false,
                  __vModel__: 'rate'
                }
              ],
              document: 'https://element.eleme.cn/#/zh-CN/component/layout',
              formId: 101,
              span: 24,
              renderKey: 1586839668999,
              componentName: 'row101',
              gutter: 15
            },
            type: 'default',
            justify: 'start',
            align: 'top'
          },
          {
            __config__: {
              label: '按钮',
              showLabel: true,
              changeTag: true,
              labelWidth: null,
              tag: 'el-button',
              tagIcon: 'button',
              span: 24,
              layout: 'colFormItem',
              document: 'https://element.eleme.cn/#/zh-CN/component/button',
              renderKey: 1594288459289
            },
            __slot__: {
              default: '测试按钮1'
            },
            type: 'primary',
            icon: 'el-icon-search',
            round: false,
            size: 'medium',
            plain: false,
            circle: false,
            disabled: false,
            on: {
              click: 'clickTestButton1'
            }
          }
        ],
        __methods__: {
          clickTestButton1() {
            console.log(
              `%c【测试按钮1】点击事件里可以访问当前表单：
                1) formModel='formData', 所以this.formData可以拿到当前表单的model
                2) formRef='elForm', 所以this.$refs.elForm可以拿到当前表单的ref(vue组件)
              `,
              'color:#409EFF;font-size: 15px'
            )
            console.log('表单的Model：', this.formData)
            console.log('表单的ref：', this.$refs.elForm)
          }
        },
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
      formConf2: {
        fields: [
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
              regList: [
                {
                  pattern: '/^1(3|4|5|7|8|9)\\d{9}$/',
                  message: '手机号格式错误'
                }
              ]
            },
            __slot__: {
              prepend: '',
              append: ''
            },
            __vModel__: 'mobile',
            placeholder: '请输入手机号',
            style: {
              width: '100%'
            },
            clearable: true,
            'prefix-icon': 'el-icon-mobile',
            'suffix-icon': '',
            maxlength: 11,
            'show-word-limit': true,
            readonly: false,
            disabled: false
          }
        ],
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
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // 异步请，回填表单数据
    fetch('https://qcl871.api.cloudendpoint.cn/fillFormData')
      .then(response => response.json())
      .then(resp => {
        if (resp.code === 0) {
          // 回填数据
          this.fillFormData(this.formConf.fields, this.formConf, resp.data)
          // 更新表单
          this.key2 = +new Date()
        }
      })
  },
  methods: {
    fillFormData(fields, formConf, data) {
      const { formModel, formRef } = formConf
      fields.forEach((item, i) => {
        const vModel = item.__vModel__
        const val = data[vModel]

        // 特殊处理el-upload，包括 回显图片，on-success等各种回调函数
        if (item.__config__.tag === 'el-upload') {
          // 回显图片
          item['file-list'] = (val || []).map(url => ({ name: `${vModel}${i}`, url }))

          if (!item.headers) item.headers = {}
          // 如果需要token，可以设置
          // item.headers.AccessToken = ''

          // 注意on-success不能绑定箭头函数！！！
          item['on-success'] = function (resp) {
            if (resp.code === 0) {
              const prev = this[formModel][vModel] || []
              this.$set(this[formModel], vModel, [
                ...prev,
                resp.data
              ])
              this.$refs[formRef].validateField(vModel)
            }
          }

          item['on-remove'] = function (file, fileList) {
            this.$set(
              this[formModel],
              vModel,
              fileList.map(f => (f.response ? f.response.data : f.url))
            )
            this.$refs[formRef].validateField(vModel)
          }

          item['before-upload'] = function (file) {
            const config = item.__config__
            let isRightSize = true
            let isAccept = true

            if (item.accept) {
              isAccept = new RegExp(`${item.accept}`).test(file.type)
              if (!isAccept) {
                setTimeout(() => {
                  this.$message({
                    message: `应该选择${item.accept}类型的文件`,
                    type: 'warning'
                  })
                })
              }
            }
            if (config.fileSize) {
              isRightSize = file.size / units[config.sizeUnit] < config.fileSize
              if (!isRightSize) {
                setTimeout(() => {
                  this.$message({
                    message: `文件大小超过 ${config.fileSize}${config.sizeUnit}`,
                    type: 'warning'
                  })
                })
              }
            }
            return isRightSize && isAccept
          }
        }

        // 设置各表单项的默认值（回填表单），包括el-upload的默认值
        if (val) {
          item.__config__.defaultValue = val
        }

        if (Array.isArray(item.__config__.children)) {
          this.fillFormData(item.__config__.children, formConf, data)
        }
      })
    },
    change() {
      this.key2 = +new Date()
      const t = this.formConf
      this.formConf = this.formConf2
      this.formConf2 = t
    },
    sumbitForm1(data) {
      console.log('sumbitForm1提交数据：', data)
    },
    sumbitForm2(data) {
      console.log('sumbitForm2提交数据：', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.test-form {
  margin: 15px auto;
  width: 800px;
  padding: 15px;
  ::v-deep .el-upload-list__item {
    transition: none !important;
  }
}
</style>
