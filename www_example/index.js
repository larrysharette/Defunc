// import { runTests } from "./performanceTests"

import TestComponent from '../Defunc/output/defunc'

// console.log(TestComponent())

// document.body.appendChild(TestComponent())

// runTests()

function DefuncToDOM(comp) {
  switch (comp.tag) {
    case 'Container':
      return 'div'
    case 'Button':
      return 'button'
    case 'Text':
      return 'p'
  }
}


function createElement(comp) {
  if (comp.type === 'value') return {
    onCreate: () => document.createTextNode(comp.value)
  }

  const nonFunctionals = Object.keys(comp.props).filter(v => typeof comp.props[v] !== 'function').reduce((t,c) =>  { t[c] = comp.props[c]; return t; }, {})
  const functionals = Object.keys(comp.props).filter(v => typeof comp.props[v] === 'function').reduce((t,c) => { t[c] = comp.props[c]; return t; }, {})
  const pub = { ...nonFunctionals };
  let element = document.createElement(DefuncToDOM(comp));
  let innerHTML = comp.value;
  const subscriptions = [];
  const asyncSubscriptions = [];

  if (Object.keys(functionals).length > 0) {
    Object.keys(functionals).map(key => element.addEventListener(key, functionals[key]))
  }

  function onCreate() {
    if (typeof comp.value === 'function') {
      element.innerHTML = comp.value(pub);
    } else if (comp.children.length > 0) {
      comp.children.forEach(el => element.appendChild(createElement(el).onCreate()))
    } else {
      element.innerHTML = comp.value;
    }
    return element;
  }
  function onUpdate(prop, value) {
    if (typeof value === 'function') {
      pub[prop] = value(pub);
    } else {
      pub[prop] = value;
    }
    _update();
  }
  async function _update() {
    element.innerHTML = comp.value(pub);
    executeSubs()
    executeAsyncSubs()
  }

  function executeSubs() {
    subscriptions.forEach((v) => v(pub));
  }

  async function executeAsyncSubs() {
    for (let i = 0; i < asyncSubscriptions.length; i++) {
      const sub = asyncSubscriptions[i];
      // console.log(sub(pub))
      await sub.then(fn => fn(pub)).catch(console.error)
    }
    // try {
    //   const data = await Promise.all(asyncSubscriptions.map((fn) => fn(pub))) 
    //   console.log(data)
    // } catch (error) {
    //   console.error(error)
    // }
  }

  function subscribe(fn) {
    if (fn instanceof Promise) {
      asyncSubscriptions.push(fn);
      return;
    }

    subscriptions.push(fn);
  }
  function subscribeAsync(fn) {
    asyncSubscriptions.push(Promise.resolve(fn));
  }

  return {
    pub,
    onCreate,
    onUpdate,
    subscribe,
    subscribeAsync,
  };
}
// console.log(createElement({ tag: 'div', props: { text: 'here we go', count: 0 }, value: `Testing ${pub.text} ${pub.count}` }));

console.log(TestComponent.pub)

const testComponent = createElement(TestComponent());
const button = createElement({ type: 'element', tag: 'Button', props: { click: testingTest }, children: [{ type: 'value', value: 'Testing' }] });

testComponent.subscribeAsync((pub) => console.log('async', JSON.stringify(pub)));

testComponent.subscribe((pub) => console.log('sync', JSON.stringify(pub)));

document.body.appendChild(testComponent.onCreate());
document.body.appendChild(button.onCreate())

function testingTest(e) {
  testComponent.onUpdate('count', ({ count }) => ++count);
}