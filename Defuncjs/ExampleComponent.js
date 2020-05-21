import { renderElement, dispatchComponentEvent } from './renderer'

function Factory() {
  this.createElement = (component) => {

  }
}

function ExampleComponentTwo() {
  this.pub = {
    state1: 'state 1',
    state2: 'state 2',
    state3: 'state 3',
    state4: 'state 4'
  }

  this.priv = {
    state1: 'state 1',
    state2: 'state 2',
    state3: 'state 3',
    state4: 'state 4'
  }

  this.onUpdate = event => {
    console.log(`I'm updating`)
    console.log(event.parent)
    event.target.innerHTML = ''
    renderElement(componentData, event.target)
  }

  this.subscribedEvents = []

  this.onStateChange = event => {
    event.stopPropagation()
    console.log('state change')
    componentData.component.children.push(ExampleComponentTwo())
    onUpdate(event)
    console.log(componentData)
  }

  this.onEventChange = () => {
    dispatchComponentEvent('changeTest', )
  }

  this.component = {
    tag: 'div',
    class: 'class-2',
    id: '1',
    children: ['ExampleComponentTwo'],
    onClick: onStateChange
  }

  return componentData
}

function ExampleComponent() {
  this.pub = {
    state1: 'state 1',
    state2: 'state 2',
    state3: 'state 3',
    state4: 'state 4'
  }

  this.priv = {
    state1: 'state 1',
    state2: 'state 2',
    state3: 'state 3',
    state4: 'state 4'
  }

  this.onUpdate = event => {
    alert(`I'm updating`)
  }

  this.subscribedEvents = ['changeTest']

  this.component = {
    tag: 'div',
    class: 'class-1',
    id: '2',
    children: [ExampleComponentTwo(), 'ExampleComponent'],
    onClick: () => alert(`I've been clicked`)
  }

  return componentData
}

export default ExampleComponent