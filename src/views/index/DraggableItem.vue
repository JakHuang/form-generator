<script>
import render from '@/components/render/render'
import { debounce } from 'throttle-debounce'

// dom属性data-drag-node作为可拖拽标识，记录着formId
const findNearestDraggableNode = element => {
  if (!element || !element.path) return undefined
  return element.path.find(el => el.dataset && el.dataset.draggableNode)
}

const activeClickItem = (event, activeItem, currentItem) => {
  activeItem(currentItem)
  event.stopPropagation()
}

let cache = {}
const setIsDragover = (self, val) => {
  self.dragover = val
}
/**
 * 产生横向或纵向的悬浮样式
 */
const buildDragoverStyle = (self, currentItem) => {
  const { formId, span } = currentItem.__config__
  if (self.dragover !== formId.toString()) return ''
  if (span < 24) return ' is-dragover vertical-mode '
  return ' is-dragover horizontal-mode '
}

/**
 * setIsDragover 和 setIsDragoverDebounce(加防抖)
 * 都是为拖拽悬停的元素提供【悬停标记:isDragover】
 */
const dragDropHandles = (self, currentItem, index, list) => ({
  dragenter: event => {
    const { formId: cscheFormId } = cache.currentItem.__config__
    const { formId } = currentItem.__config__
    if (formId === cscheFormId) return
    // 将isDragover设置为true(立即执行)
    setIsDragover(self, formId)
  },
  dragleave: event => {
    const { formId: cscheFormId } = cache.currentItem.__config__
    const { isWrapper, formId } = currentItem.__config__
    if (formId === cscheFormId) return
    // 将isDragover设置为false(防抖执行)
    self.setIsDragoverDebounce(self, -1)
  },
  dragover: event => {
    event.preventDefault()
    const dropNode = findNearestDraggableNode(event)
    const { formId: cscheFormId } = cache.currentItem.__config__
    const { isWrapper, formId } = currentItem.__config__
    if (!dropNode || formId === cscheFormId) return
    self.setIsDragoverDebounce(self, dropNode.dataset.draggableNode)
  },
  dragstart: event => {
    event.stopPropagation()
    cache = { currentItem, index, list }
  },
  drop: event => {
    event.preventDefault()
    self.setIsDragoverDebounce(self, -1)
    if (!cache) return

    const { formId: cscheFormId } = cache.currentItem.__config__
    const { isWrapper, formId } = currentItem.__config__
    if (formId !== cscheFormId) {
      // 根据被拖动的节点的isWrapper，判读是交换位置还是拖入
      if (isWrapper) {
        const { children } = currentItem.__config__
        Array.isArray(children)
          ? children.push(cache.currentItem) // 待优化，不一定是push
          : self.$set(currentItem, 'children', [cache.currentItem])
        cache.list.splice(cache.index, 1)
      } else {
        // cache.currentItem和currentItem 位置互换
        self.$set(list, index, cache.currentItem)
        self.$set(cache.list, cache.index, currentItem)
      }
      // 高亮被拖动的节点
      self.$listeners.activeItem(cache.currentItem)
      cache = null
    }
  }
})

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
    config.isWrapper = false
    const child = renderChildren.apply(this, arguments)
    let className = this.activeId === config.formId ? 'drawing-item active-from-item' : 'drawing-item'
    if (this.formConf.unFocusedComponentBorder) className += ' unfocus-bordered'
    className += buildDragoverStyle(this, currentItem) // 使用悬停标记
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
    if (config.showLabel === false) labelWidth = '0'
    return (
      <el-col span={config.span} class={className} draggable data-draggable-node={config.formId}
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
    config.isWrapper = true
    let className = this.activeId === config.formId
      ? 'drawing-row-item active-from-item'
      : 'drawing-row-item'
    className += buildDragoverStyle(this, currentItem) // 使用悬停标记
    const child = renderChildren.apply(this, arguments)
    const flexProps = {}
    if (currentItem.type === 'flex') {
      const { type, justify, align } = currentItem
      flexProps.props = { type, justify, align }
    }
    return (
      <el-col span={config.span} class={`${className} drawing-item drag-wrapper`}
        draggable data-draggable-node={config.formId}
        {...{ nativeOn: dragDropHandles(this, currentItem, index, list) }}
      >
        <span class="component-name">{config.componentName}</span>
        <el-row gutter={config.gutter} {...flexProps}
          nativeOnClick={event => activeClickItem(event, activeItem, currentItem)}>
          {child}
        </el-row>
        {components.itemBtns.apply(this, arguments)}
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
    render
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
      setIsDragoverDebounce: debounce(60, setIsDragover),
      dragover: -1
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
