import React from 'react'
import ReactDOM from 'react-dom'
import * as wasm from "../pkg"

const performanceData = [{
  renderer: 'Defunc Renderer'
},{
  renderer: 'Javascript Renderer'
},{
  renderer: 'React Renderer'
}]

export function runTests() {
  for (let i = 1; i <= 5000; i += 1000) {
    for (let j = 1; j <= 8; j += 2) {
      let count = wasm.generate_data(i, j)
      const data = setup_test_data(i, j)

      let start = performance.now()
      wasm.main()
      let finish = performance.now()

      performanceData[0][count] = finish - start

      document.body.innerHTML = ''

      start = performance.now()
      render(data)
      finish = performance.now()

      performanceData[1][count] = finish - start

      document.body.innerHTML = ''

      start = performance.now()
      react_render_test(data)
      finish = performance.now()

      ReactDOM.unmountComponentAtNode(document.body)

      performanceData[2][count] = finish - start
    } 
  }

  console.table(performanceData)
}

function setup_test_data(elementCount, levelCount) {
  const data = []
  let count = 0

  for (let i = 1; i < elementCount; i++) {
    count++
    let element ={
      tag: 'div',
      text: 'Parent',
      class: '',
      children: []
    }
    if (i % 50 === 0) {
      const result = create_inner_html(levelCount)
      element.children = result.elements
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
      children: []
    }
    if (i % 3 === 0) {
      const result = create_inner_html(level - 1)
      element.children = result.elements
      count += result.count
    }
    elements.push(element)
  }

  return {
    elements, count
  }
}

function react_render_test(result) {
  ReactDOM.render(result.data.map(elem => react_render_element(elem)), document.body)
}

function react_render_element(element) {
  return React.createElement(element.tag, { className: element.class }, element.children.length > 0 ? element.children.map(elem => react_render_element(elem)) : element.text)
}

function render(result) {

  result.data.forEach(v => document.body.appendChild(render_element(v)))

  return result.count
}

function render_element(element) {
  const val = document.createElement(element.tag)

  if (element.children.length > 0) {
    element.children.forEach(ele => val.appendChild(render_element(ele)))
  } else {
    val.innerHTML  = element.text
  }
  val.className = element.class

  val.addEventListener("click", e => {
    console.log(e.target.innerHTML)
  })
  return val
}
