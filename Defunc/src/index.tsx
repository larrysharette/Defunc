import Defunc from './render'

const placeholder = `__jsxPlaceholder${Date.now()}`

const TYPE = {
  element: 'element',
  value: 'value',
  props: 'props'
}

function jsx(splits: TemplateStringsArray, ...values: string[]) {
  const root = parseElement(splits.raw.join(placeholder), values)
  return root
}

const createDefuncElement = (node) => {
  if (node.type === TYPE.value) {
    return node.value
  }

  return Defunc.createElement(
    node.tag,
    node.props.props,
    ...node.children.map(createDefuncElement),
  )
}

export interface DefuncProps {
  type: string
  length: number
  props: {
    [key: string]: any
  }
}

export interface DefuncNode {
  type: string
  tag?: string | undefined
  props?: DefuncProps
  children?: DefuncNode[]
  length: number
  name?: string
  value: unknown
}

interface DefuncValue {
  type: string
  value: unknown
  length: number
}

function parseElement(str: string, values: string[]): DefuncNode | DefuncNode[] {
  let match: RegExpMatchArray | null
  let length: number
  const node: DefuncNode = {
    type: TYPE.element,
    tag: placeholder,
    props: parseProps('', []),
    children: [],
    length: 0,
    name: '',
    value: null
  }

  match = str.match(/<(\w+)/)

  if (!match) {
    str = str.split('<')[0]

    return parseValues(str, values)
  }

  node.name = match[1]
  node.tag = node.name === placeholder ? values.shift() : node.name
  length = match.index + match[0].length
  str = str.slice(length)
  node.length += length

  match = str.match(/>/)

  if (!match) return node

  node.props = parseProps(str.slice(0, match.index), values)
  length = node.props.length
  str = str.slice(length)
  node.length += length

  match = str.match(/^ *\/ *>/)

  if (match && match.index) {
    node.length += match.index + match[0].length

    return node
  }

  match = str.match(/>/)

  if (!match) return node

  length = match.index + 1
  str = str.slice(length)
  node.length += length

  let children: DefuncNode[] = []

  const parseNextChildren = () => {
    const empty: DefuncNode[] = []
    children = empty.concat(parseElement(str, values))
  }

  parseNextChildren()

  while (children.length) {
    children.forEach((child) => {
      length = child.length
      str = str.slice(length)
      node.length += length

      if ((child.type !== TYPE.value || child.value) && node.children) {
        node.children.push(child)
      }
    })

    parseNextChildren()
  }

  match = str.match(new RegExp(`</${node.name}>`))

  if (!match) return node

  node.length += match.index + match[0].length

  if (node.name === placeholder) {
    const value = values.shift()

    if (value !== node.tag) return node
  }

  return node
}

function parseProps(str: string, values: string[]): DefuncProps {
  let match: RegExpMatchArray | null = str.match(/ *\w+="(?:.*[^\\]")?/) ||
  str.match(new RegExp(` *\\w+=${placeholder}`)) ||
  str.match(/ *\w+/)

  let length: number

  const node: DefuncProps = {
    type: TYPE.props,
    length: 0,
    props: {},
  }

  const matchNextProp = () => {
    match =
    str.match(/ *\w+="(?:.*[^\\]")?/) ||
    str.match(new RegExp(` *\\w+=${placeholder}`)) ||
    str.match(/ *\w+/)
  }

  if (!match) return node

  while (match) {
    const propStr = match[0]
    let [key, ...value] = propStr.split('=')
    node.length += propStr.length
    key = key.trim()
    let strValue: string | boolean = value.join('=')
    strValue = strValue ? strValue.slice(1, -1) : true
    node.props[key] = value
    str = str.slice(0, match.index) + str.slice(match.index + propStr.length)

    matchNextProp()
  }

  return node
}
  
function parseValues(str: string, values: string[]): DefuncNode[] {
  const nodes: DefuncNode[] = []

  str.split(placeholder).forEach((split, index, splits) => {
    let value
    let length

    value = split
    length = split.length
    str = str.slice(length)

    if (length) {
      nodes.push({
        type: TYPE.value,
        length,
        value
      })
    }

    if (index === splits.length - 1) return

    value = values.pop()
    length = placeholder.length

    if (typeof value === 'string') {
      value = value.trim()
    }

    nodes.push({
      type: TYPE.value,
      length,
      value
    })
  })

  return nodes
}

function TestComponent() {
  TestComponent.pub = {
    state1: 'test'
  }
  return jsx`
    <Container inline onClick={handleClick}>
      <Text>Hello {pub.state1}</Text>
    </Container>`
}

export default TestComponent