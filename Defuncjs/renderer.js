let store = {

}

let events = {

}

function render(result) {

  result.data.forEach(v => renderElement(v, document.body))

  return result.count
}

let keyIndex = 0

window.events = events
window.store = store

export function dispatchStoreChange(key, newState) {
  store[key] = newState
  renderElement(elemen, document.getElementById(key))
}

export function dispatchComponentEvent(eventName, changeFn) {

}

export function renderElement(element, node) {
  if (typeof element === 'string') {
    node.appendChild(document.createTextNode(element))
    return
  }

  console.log(element)

  const { component } = element

  // if (!component.id || Object.keys(store).indexOf(component.id) > -1) {
  //   if (component.id) {
  //     component.id = `${component.id}-${keyIndex}`
  //   } else {
  //     component.id = keyIndex
  //   }
  //   keyIndex++
  // }

  // if (element.subscribedEvents.length > 0) {
  //   for (let i = 0; i < element.subscribedEvents.length; i++) {
  //     const e = element.subscribedEvents[i];
  //     const newEvent = new Event(e)
  //     events[e] = newEvent
  //   }
  // }

  // store[component.id] = element.pub

  const val = document.createElement(component.tag)

  if (component.children.length > 0) {
    component.children.forEach(ele => renderElement(ele, val))
  }

  val.className = component.class

  val.id = component.id

  for (let i = 0; i < Object.keys(component).length; i++) {
    const key = Object.keys(component)[i];
    switch(key) {
      case 'onClick':
        val.addEventListener("click", component.onClick)
        break
      default:
        break
    }
  }

  
  node.appendChild(val)
}