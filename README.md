# Defunc Web Framework (Prototype Stage)

This is a new web framework that is built using Rust.

It uses wasm-bindgen to compile rust to WebAssembly and create the needed Javascript bindings to the execute code.

It uses web-sys to handle the rendering to page.

## Current Stage

Currently the renderer generates a large amount of data as a test of the renderer's speed.

Next I'll look into creating the syntax I want to use to create components. Then I'll work on a parser that creates the data structure needed for the renderer.