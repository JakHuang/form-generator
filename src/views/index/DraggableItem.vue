<script>
import draggable from 'vuedraggable'
import render from '@/components/render/render'
import { debounce } from 'throttle-debounce'

const activeClickItem = (event, activeItem, currentItem) => {
  activeItem(currentItem)
  event.stopPropagation()
}

let cache = {}
const setIsDragover = (self, currentItem, val) => {
  self.$set(currentItem.__config__, 'isDragover', val)
}

/**
 * setIsDragover 和 setIsDragoverDebounce(加防抖)
 * 都是为拖拽悬停的元素提供【悬停标记:isDragover】
 */
const dragDropHandles = (self, currentItem, index, list) => ({
  dragenter: event => {
    // 将isDragover设置为true(立即执行)
    setIsDragover(self, currentItem, true)
  },
  dragleave: event => {
    // 将isDragover设置为false(防抖执行)
    self.setIsDragoverDebounce(self, currentItem, false)
  },
  dragover: event => {
    self.setIsDragoverDebounce(self, currentItem, true)
  },
  dragstart: event => {
    cache = { currentItem, index, list }
  },
  drop: event => {
    self.setIsDragoverDebounce(self, currentItem, false)
    if (cache) {
      // cache.currentItem和currentItem 位置互换
      self.$set(list, index, cache.currentItem)
      self.$set(cache.list, cache.index, currentItem)
      // 高亮被拖动的节点
      self.$listeners.activeItem(cache.currentItem)
      cache = null
    }
  }
})

const buildDragoverStyle = currentItem => {
  const { isDragover, span } = currentItem.__config__
  if (!isDragover) return ''
  if (span < 24) return ' is-dragover vertical-mode '
  return ' is-dragover horizontal-mode '
}

const components = {
  itemBtns(h, currentItem, index, list) {
    const { copyItem, deleteItem } = this.$listeners
    return [
      <span class="drawing-item-copy" title="复制" onClick={event => {
        copyItem(currentItem, list); event.stopPropagation()
      }}>
        <i class="el-icon-copy-document" />
      </span>,
      <span class="drawing-item-delete" title="删除" onClick={event => {
        deleteItem(index, list); event.stopPropagation()
      }}>
        <i class="el-icon-delete" />
      </span>
    ]
  }
}
const layouts = {
  colFormItem(h, currentItem, index, list) {
    const { activeItem } = this.$listeners
    const config = currentItem.__config__
    const child = renderChildren.apply(this, arguments)
    let className = this.activeId === config.formId ? 'drawing-item active-from-item' : 'drawing-item'
    if (this.formConf.unFocusedComponentBorder) className += ' unfocus-bordered'
    className += buildDragoverStyle(currentItem) // 使用悬停标记
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
    if (config.showLabel === false) labelWidth = '0'
    return (
      <el-col span={config.span} class={className} draggable
        {...{ nativeOn: dragDropHandles(this, currentItem, index, list) }}
        nativeOnClick={event => activeClickItem(event, activeItem, currentItem)}>
        <el-form-item label-width={labelWidth}
          label={config.showLabel ? config.label : ''} required={config.required}>
          <render key={config.renderKey} conf={currentItem} onInput={ event => {
            this.$set(config, 'defaultValue', event)
          }}>
            {child}
          </render>
        </el-form-item>
        {components.itemBtns.apply(this, arguments)}
      </el-col>
    )
  },
  rowFormItem(h, currentItem, index, list) {
    const { activeItem } = this.$listeners
    const config = currentItem.__config__
    const className = this.activeId === config.formId
      ? 'drawing-row-item active-from-item'
      : 'drawing-row-item'
    let child = renderChildren.apply(this, arguments)
    if (currentItem.type === 'flex') {
      child = <el-row type={currentItem.type} justify={currentItem.justify} align={currentItem.align}>
              {child}
            </el-row>
    }
    return (
      <el-col span={config.span}>
        <el-row gutter={config.gutter} class={className}
          nativeOnClick={event => activeClickItem(event, activeItem, currentItem)}>
          <span class="component-name">{config.componentName}</span>
          <draggable list={config.children || []} animation={340}
            group="componentsGroup" class="drag-wrapper">
            {child}
          </draggable>
          {components.itemBtns.apply(this, arguments)}
        </el-row>
      </el-col>
    )
  },
  raw(h, currentItem, index, list) {
    const config = currentItem.__config__
    const child = renderChildren.apply(this, arguments)
    return <render key={config.renderKey} conf={currentItem} onInput={ event => {
      this.$set(config, 'defaultValue', event)
    }}>
      {child}
    </render>
  }
}

function renderChildren(h, currentItem, index, list) {
  const config = currentItem.__config__
  if (!Array.isArray(config.children)) return null
  return config.children.map((el, i) => {
    const layout = layouts[el.__config__.layout]
    if (layout) {
      return layout.call(this, h, el, i, config.children)
    }
    return layoutIsNotFound.call(this)
  })
}

function layoutIsNotFound() {
  throw new Error(`没有与${this.currentItem.__config__.layout}匹配的layout`)
}

export default {
  components: {
    render,
    draggable
  },
  props: [
    'currentItem',
    'index',
    'drawingList',
    'activeId',
    'formConf'
  ],
  data() {
    return {
      setIsDragoverDebounce: debounce(60, setIsDragover)
    }
  },
  render(h) {
    const layout = layouts[this.currentItem.__config__.layout]

    if (layout) {
      return layout.call(this, h, this.currentItem, this.index, this.drawingList)
    }
    return layoutIsNotFound.call(this)
  }
}
</script>
