<template>
  <div>
    <el-dialog v-bind="$attrs" v-on="$listeners" width="500px" @open="onOpen" @close="onClose"
      :close-on-click-modal="false" :modal-append-to-body="false">
      <el-row :gutter="15">
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
          <el-col :span="24">
            <el-form-item label="生成类型" prop="type">
              <el-radio-group v-model="formData.type" size="medium">
                <el-radio-button v-for="(item, index) in typeOptions" :key="index" :label="item.value"
                  :disabled="item.disabled">{{item.label}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="文件名" prop="fileName" v-if="showFileName">
              <el-input v-model="formData.fileName" placeholder="请输入文件名" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  props: ['showFileName'],
  data() {
    return {
      formData: {
        fileName: undefined,
        type: 'file',
      },
      rules: {
        fileName: [{
          required: true,
          message: '请输入文件名',
          trigger: 'blur'
        }],
        type: [{
          required: true,
          message: '生成类型不能为空',
          trigger: 'change'
        }],
      },
      typeOptions: [{
        "label": "页面",
        "value": 'file'
      }, {
        "label": "弹窗",
        "value": 'dialog'
      }],
    }
  },
  computed: {
  },
  watch: {},
  mounted() {},
  methods: {
    onOpen() {
      if(this.showFileName) {
        this.formData.fileName = `${+new Date()}.vue`
      }
    },
    onClose() {
    },
    close(e) {
      this.$emit('update:visible', false)
    },
    handelConfirm() {
      this.$refs.elForm.validate(valid => {
        if(!valid) return
        this.$emit('confirm', Object.assign({}, this.formData))
        this.close()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>