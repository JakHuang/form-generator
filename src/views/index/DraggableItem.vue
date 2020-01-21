<script>
import draggable from 'vuedraggable'
import render from '@/components/render'

const components = {
  itemBtns(h, element, index, parent) {
    const { copyItem, deleteItem } = this.$listeners
    return [<span class="drawing-item-copy" title="复制" onClick={event => {
      copyItem(element, parent); event.stopPropagation()
    }}>
        <i class="el-icon-copy-document" />
      </span>,
      <span class="drawing-item-delete" title="删除" onClick={event => {
        deleteItem(index, parent); event.stopPropagation()
      }}>
        <i class="el-icon-delete" />
      </span>]
  }
}
const layouts = {
  colFormItem(h, element, index, parent) {
<<<<<<< HEAD
    let {activeItem} = this.$listeners,
      className = this.activeId == element.formId ? 'drawing-item active-from-item' : 'drawing-item'
=======
    const { activeItem } = this.$listeners
    let className = this.activeId === element.formId ? 'drawing-item active-from-item' : 'drawing-item'
    if (this.formConf.unFocusedComponentBorder) className += ' unfocus-bordered'
>>>>>>> 432760c... 引入新的eslint规则后，代码整理
    return (<el-col span={element.span} class={className}
      nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
      <el-form-item label-width={element.labelWidth ? `${element.labelWidth}px` : null}
        label={element.label} required={element.required}>
        <render conf={element} onInput={event => { this.$set(element, 'defaultValue', event) }} />
      </el-form-item>
      {components.itemBtns.apply(this, arguments)}
    </el-col>)
  },
  rowFormItem(h, element, index, parent) {
    const { activeItem } = this.$listeners
    const className = this.activeId === element.formId ? 'drawing-row-item active-from-item' : 'drawing-row-item'
    return (
      <el-col span={element.span}>
        <el-row class={className} nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
          <span class="component-name">{element.componentName}</span>
          <draggable list={element.children} animation={340} group="componentsGroup" class="drag-wrapper">
            <el-row type={element.type} justify={element.justify} align={element.align} gutter={element.gutter}>
              {renderChildren.apply(this, arguments)}
            </el-row>
          </draggable>
          {components.itemBtns.apply(this, arguments)}
        </el-row>
      </el-col>
    )
  }
}

function renderChildren(h, element, index, parent) {
  if (!Array.isArray(element.children)) return null
  return element.children.map((el, i) => {
    const layout = layouts[el.layout]
    if (layout) {
      return layout.call(this, h, el, i, element.children)
    }
    return layoutIsNotFound()
  })
}

function layoutIsNotFound() {
  throw new Error(`没有与${this.element.layout}匹配的layout`)
}

export default {
<<<<<<< HEAD
  props: ['element', 'index', 'drawingList', 'activeId'],
=======
>>>>>>> 432760c... 引入新的eslint规则后，代码整理
  components: {
    render,
    draggable
  },
<<<<<<< HEAD
=======
  props: [
    'element',
    'index',
    'drawingList',
    'activeId',
    'formConf'
  ],
>>>>>>> 432760c... 引入新的eslint规则后，代码整理
  render(h) {
    const layout = layouts[this.element.layout]

    if (layout) {
      return layout.call(this, h, this.element, this.index, this.drawingList)
    }
    return layoutIsNotFound()
  }
}
</script>
