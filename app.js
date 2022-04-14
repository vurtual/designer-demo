const qs = elem => document.querySelector(elem)
const qsa = elem => Array.from(document.querySelectorAll(elem))

const th = qsa('th')
const dimensions = qs('.dimensions > .scroll-area')
const properties = qs('.properties > .scroll-area')
const measures = qs('.measures > .scroll-area')
const mainDate = qs('.date > .scroll-area')

const buttonTemplate = qs('.button-template')

const mousedownHandler = e => {
  const element = e.target
  const index = e.target.cellIndex
  const datatype = element.dataset.type
  const draggableElement = document.createElement('div')
  draggableElement.textContent = element.textContent
  draggableElement.classList.add('draggable')
  draggableElement.style.left = e.x + 'px'
  draggableElement.style.top = e.y + 'px'
  draggableElement.setAttribute('data-index', index)
  draggableElement.setAttribute('data-type', datatype)
  element.append(draggableElement)
  setDroppable(datatype)
}

const mousemoveHandler = e => {
  const draggableElement = qs('.draggable')
  if (draggableElement) {
    draggableElement.style.left = e.x + 'px'
    draggableElement.style.top = e.y + 'px'
  }
}

const setDroppable = datatype => {
  if (datatype === 'string') {
    mainDate.parentElement.dataset.status = 'not-droppable'
    measures.parentElement.dataset.status = 'not-droppable'
    console.log(datatype === 'string', mainDate.parentElement.dataset.status)
  }
  if (datatype === 'numeric') {
    mainDate.parentElement.dataset.status = 'not-droppable'
  }
  if (datatype === 'date') {
    measures.parentElement.dataset.status = 'not-droppable'
  }
}

const mouseupHandler = e => {
  const draggableElement = qs('.draggable')
  mainDate.parentElement.dataset.status = 'droppable'
  measures.parentElement.dataset.status = 'droppable'
  if (draggableElement) {
    draggableElementDrop(e)
    draggableElement.remove()
  }
}

const clickHandler = e => {
  if (!e.target.matches('.remove')) return
  removeButton(e.target.closest('button'))
}

const removeButton = button => {
  const index = button.dataset.index
  th[index].dataset.allocatedto = 'none'
  button.remove()
}

const draggableElementDrop = e => {
  const draggable = qs('.draggable')
  const index = draggable.dataset.index
  const _th = th[index]
  if (intersects(e, dimensions)) {
    if (addButton(dimensions, draggable)) {
      if (_th.dataset.allocatedto !== 'none') {
        removeElem(index, _th.dataset.allocatedto)
      }
      _th.dataset.allocatedto = 'dimensions'
    }
  } else if (intersects(e, properties)) {
    if (addButton(properties, draggable)) {
      if (_th.dataset.allocatedto !== 'none') {
        removeElem(index, _th.dataset.allocatedto)
      }
      _th.dataset.allocatedto = 'properties'
    }
  } else if (intersects(e, measures)) {
    if (addButton(measures, draggable)) {
      if (_th.dataset.allocatedto !== 'none') {
        removeElem(index, _th.dataset.allocatedto)
      }
      _th.dataset.allocatedto = 'measures'
    }
  } else if (intersects(e, mainDate)) {
    if (addButton(mainDate, draggable)) {
      if (_th.dataset.allocatedto !== 'none') {
        removeElem(index, _th.dataset.allocatedto)
      }
      _th.dataset.allocatedto = 'date'
    }
  } else {
    showOptions(e.target)
  }
}

const removeElem = (index, selector) => {
  selector = `.${selector} > .scroll-area > button[data-index="${index}"]`
  console.log(selector, index)
  const button = qs(selector)
  button.remove()
}

const intersects = (e, elem) => {
  const rect = elem.getBoundingClientRect()
  return (
    e.x > rect.x &&
    e.x < rect.x + rect.width &&
    e.y > rect.y &&
    e.y < rect.y + rect.height
  )
}

const showOptions = elem => {}

const addButton = (elem, draggable) => {
  if (elem === measures && draggable.dataset.type !== 'numeric') return false
  if (elem === mainDate && draggable.dataset.type !== 'date') return false
  const index = draggable.dataset.index
  const clone = buttonTemplate.content.cloneNode(true)
  const button = clone.querySelector('button')
  const textElem = clone.querySelector('.text')
  textElem.innerText = draggable.textContent
  button.dataset.index = draggable.dataset.index
  elem.appendChild(clone)
  return true
}

th.forEach(cell => cell.addEventListener('mousedown', mousedownHandler))
document.addEventListener('mousemove', mousemoveHandler)
document.addEventListener('mouseup', mouseupHandler)
document.addEventListener('click', clickHandler)
