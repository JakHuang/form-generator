const DRAWING_ITEMS = 'drawingItems'
const DRAWING_ID = 'idGlobal'
const TREE_NODE_ID = 'treeNodeId'
const FORM_CONF = 'formConf'

// 在vscode-plugin分支中替换localStorage.getItem
function getStorageItem(key) {
  window.parent.postMessage({
    cmd: 'getStorageItem',
    data: {
      key
    }
  }, '*')
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
