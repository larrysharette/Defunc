import ExampleComponent from './ExampleComponent'
import { renderElement } from './renderer'

export function renderTest() {
  console.log(new ExampleComponent())
  renderElement(ExampleComponent(), document.body)

  console.log(ExampleComponent())
}
