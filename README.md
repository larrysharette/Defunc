# Defunc Web Framework (Prototype Stage)

## Journal

### 5-20-2020

I've been working on the internals of how the structure of components are written. I'm still focusing on using JSX as the templating engine but I keep feeling like I'm recreating a form of a virtual dom. So far I've been researching how other frameworks are built and I'm looking at Svelte because of the performance.

So far what I've built is dirty but the general idea is that components will get wrapped around a createElement function that exposes the onCreate, onUpdate, subscribe, and subscribeAsync. Names aren't great but its close enough.

- onCreate creates the DOM element and returns it. Since it returns a DOM Element the caller handles the mounting of it element. This allows for recurvisely mounting elements when the component has children.
- onUpdate allows Component B to update specific state on Component A which then causes Component A to rerender.
- subscribe allows any other components to subscribe to render changes on that specific component, this is blocking.
- subscribeAsync is a non-blocking version of subscribe.

Because I'm looking at compile project files, my plan is to create an element for each written component. So instead of starting of starting with a single component and recursively mounting from there, the idea is to "mount" the written elements and if we come a cross an imported component then we check to see if it is created then get that element and mount it.

This is SHOULD avoid a virtual dom like structure. Hopefully...

So I think I'm going to go with component classes for now because I can't seem to accomplish what I want without some classes like features. I want other components to be able to read public properties of a component (this would act as a global).

I don't know I'm playing around with a bunch of different concepts, and prototyping. I need to write down the goals of this framework more concisely so I can compare my progress against it.