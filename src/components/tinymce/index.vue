<template>
  <textarea :id="tinymceId" class="textarea" />
</template>

<script>
import loadTinymce from '@/utils/loadTinymce'
import { plugins, toolbar } from './config'

let num = 1

export default {
  props: {
    id: {
      type: String,
      default: () => {
        num === 10000 && (num = 1)
        return `tinymce${+new Date()}${num++}`
      }
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tinymceId: this.id
    }
  },
  computed: {

  },
  watch: {

  },
  mounted() {
    loadTinymce(tinymce => {
      import('./zh_CN')
      tinymce.init({
        selector: `#${this.tinymceId}`,
        language: 'zh_CN',
        menubar: 'file edit insert view format table',
        plugins,
        toolbar,
        height: this.$attrs.height || 300,
        branding: this.$attrs.branding || false,
        object_resizing: false,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true,
        init_instance_callback: editor => {
          if (this.value) {
            editor.setContent(this.value)
          }
        }
      })
    })
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.textarea{
  visibility: hidden;
}
</style>
