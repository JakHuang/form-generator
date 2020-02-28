const DRAWING_ITEMS = 'drawingItems'
const DRAWING_ITEMS_VERSION = '1.0'
const DRAWING_ITEMS_VERSION_KEY = 'DRAWING_ITEMS_VERSION'
const DRAWING_ID = 'idGlobal'
const TREE_NODE_ID = 'treeNodeId'
const FORM_CONF = 'formConf'

// 在vscode-plugin分支中替换localStorage.getItem
function getStorageItem(key) {
  if (window.$DB) return window.$DB[key]
  return null
}

// 在vscode-plugin分支中替换localStorage.setItem
function setStorageItem(key, val) {
  window.parent.postMessage({
    cmd: 'setStorageItem',
    data: {
      key,
      val
    }
  }, '*')
}

export function getDrawingList() {
  // 加入缓存版本的概念，保证缓存数据与程序匹配
  const version = getStorageItem(DRAWING_ITEMS_VERSION_KEY)
  if (version !== DRAWING_ITEMS_VERSION) {
    setStorageItem(DRAWING_ITEMS_VERSION_KEY, DRAWING_ITEMS_VERSION)
    saveDrawingList([])
    return null
  }

  const str = getStorageItem(DRAWING_ITEMS)
  if (str) return JSON.parse(str)
  return null
}

export function saveDrawingList(list) {
  setStorageItem(DRAWING_ITEMS, JSON.stringify(list))
}

export function getIdGlobal() {
  const str = getStorageItem(DRAWING_ID)
  if (str) return parseInt(str, 10)
  return 100
}

export function saveIdGlobal(id) {
  setStorageItem(DRAWING_ID, `${id}`)
}

export function getTreeNodeId() {
  const str = getStorageItem(TREE_NODE_ID)
  if (str) return parseInt(str, 10)
  return 100
}

export function saveTreeNodeId(id) {
  setStorageItem(TREE_NODE_ID, `${id}`)
}

export function getFormConf() {
  const str = getStorageItem(FORM_CONF)
  if (str) return JSON.parse(str)
  return null
}

export function saveFormConf(obj) {
  setStorageItem(FORM_CONF, JSON.stringify(obj))
}
