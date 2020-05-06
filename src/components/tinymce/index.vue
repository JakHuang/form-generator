<template>
  <textarea :id="tinymceId" class="textarea" />
</template>

<script>
import loadTinymce from '@/utils/loadTinymce'
import { plugins, toolbar } from './config'
import { debounce } from 'throttle-debounce'

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
      type: [String, Number, Boolean],
      default: ''
    }
  },
  data() {
    return {
      tinymceId: this.id
    }
  },
  mounted() {
    loadTinymce(tinymce => {
      import('./zh_CN').then(() => {
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
            if (this.value) editor.setContent(this.value)
            this.vModel(editor)
          }
        })
      })
    })
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    vModel(editor) {
      // 控制连续写入时setContent的触发频率
      const debounceSetContent = debounce(250, editor.setContent)
      this.$watch('value', (val, prevVal) => {
        if (editor && val !== prevVal && val !== editor.getContent()) {
          if (typeof val !== 'string') val = val.toString()
          debounceSetContent.call(editor, val)
        }
      })

      editor.on('change keyup undo redo', () => {
        this.$emit('input', editor.getContent())
      })
    },
    destroyTinymce() {
      if (!window.tinymce) return
      const tinymce = window.tinymce.get(this.tinymceId)
      if (tinymce) {
        tinymce.destroy()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.textarea{
  visibility: hidden;
}
</style>
