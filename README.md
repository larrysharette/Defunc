# Defunc Web Framework (Prototype Stage)

This is a new web framework that is built using Rust.

It uses wasm-bindgen to compile rust to WebAssembly and create the needed Javascript bindings to the execute code.

It uses web-sys to handle the rendering to page.

## Current Stage

Currently the renderer generates a large amount of data as a test of the renderer's speed.

Next I'll look into creating the syntax I want to use to create components. Then I'll work on a parser that creates the data structure needed for the renderer.

## Current Performance

Defunc renderer:
- 939,955 elements with 2 levels max = 11,979.32ms
- 136,768 elements with 5 levels max = 1927.29ms
- 2,923,375 elements with 10 levels max = 67,284.90ms
- 72,309 elements with 8 levels max = 987.11ms

Javascript renderer:
- 939,955 elements with 2 levels max = 11,681.48ms
- 136,768 elements with 5 levels max = 1080.65ms
- 2,923,375 elements with 10 levels max = 22,193.67ms
- 72,309 elements with 8 levels max = 412.60ms