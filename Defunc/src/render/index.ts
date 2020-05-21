namespace Defunc {

  export class DefuncComponent {
    
  }

  export function createElement(tag: string, props: DefuncProps, ...children) {
    console.log(tag, props, children)
    if (!tag) return
      let elem = document.createElement(tag)

      if (children.length > 0) {
        children.forEach((child: DefuncNode | string) => {
          if (typeof child === 'string') {
            const text = document.createTextNode(child)
            elem.appendChild(text)
          } else {
            console.log(child)
            elem.appendChild(createElement(child.tag, child.props, ...child.children))
          }
        })
      }
      return elem
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
    value: unknown | string
  }
}

export default Defunc