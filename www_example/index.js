import * as wasm from "../pkg"

let start = performance.now()
let count = wasm.run()
let finish = performance.now()

console.log(`WASM Rendered ${count} elements in ${finish - start} ms`)

console.log('Pausing for now.')

setTimeout(() => {
  document.body.innerHTML = ''

  start = performance.now()
  count = render()
  finish = performance.now()

  console.log(`Javascript Rendered ${count} elements in ${finish - start} ms`)
}, 5000)


function setup_test_data() {
  const data = []
  let count = 0

  for (let i = 1; i < 500000; i++) {
    count++
    let element ={
      tag: 'div',
      text: 'Parent',
      class: '',
      inner_html: []
    }
    if (i % 50 === 0) {
      const result = create_inner_html(2)
      element.inner_html = result.elements
      count += result.count
    }
    data.push(element)
  }
  return {
    data,
    count
  }
}

function create_inner_html(level) {
  const elements = []
  let count = 0

  if (level === 0) return {elements,count}

  for (let i = 1; i < 12; i++) {
    count++
    let element ={
      tag: 'div',
      text: `Level ${level}`,
      class: `class-${level}`,
      inner_html: []
    }
    if (i % 3 === 0) {
      const result = create_inner_html(level - 1)
      element.inner_html = result.elements
      count += result.count
    }
    elements.push(element)
  }

  return {
    elements, count
  }
}

function render() {
  const result = setup_test_data()

  result.data.forEach(v => document.body.appendChild(render_element(v)))

  return result.count
}

function render_element(element) {
  const val = document.createElement(element.tag)

  if (element.inner_html.length > 0) {
    element.inner_html.forEach(ele => val.appendChild(render_element(ele)))
  } else {
    val.innerHTML  = element.text
  }
  val.className = element.class
  return val
}