#![allow(unused_variables)]

use wasm_bindgen::prelude::*;

#[allow(dead_code)]
#[derive(Default, Debug, Clone)]
struct JSXElement {
    id: String,
    tag: String,
    inner_html: Vec<Box<JSXElement>>,
    text: Option<String>,
    class: Option<String>,
    style: Option<String>,
}

impl JSXElement {
    fn new(
        id: &str,
        tag: &str,
        inner_html: Vec<Box<JSXElement>>,
        text: &str,
        class: &str,
        style: &str,
    ) -> JSXElement {
        JSXElement {
            id: id.to_string(),
            tag: tag.to_string(),
            inner_html: inner_html,
            text: Some(text.to_string()),
            class: Some(class.to_string()),
            style: Some(style.to_string()),
        }
    }

    fn on_event() {
        println!("handling on_event")
    }
}

fn create_inner_html(id: &str, level: u8) -> (Vec<Box<JSXElement>>, u32) {
    let mut inner: Vec<Box<JSXElement>> = vec![];
    let mut count = 0;

    if level == 0 {
        return (inner, 0);
    }

    for i in 1..12 {
        count += 1;
        let modulated_value = i % 3;
        let newId = "{id}{i.to_string()}";
        let levelText = format!("Level {}", level);
        let levelClass = format!("class-{}", level);
        let mut new_element: JSXElement =
            JSXElement::new(newId, "div", vec![], &levelText, &levelClass, "");

        if modulated_value == 0 {
            let result = create_inner_html(newId, level - 1);
            new_element.inner_html = result.0;
            count += result.1;
        }

        inner.push(Box::new(new_element));
    }

    return (inner, count);
}

fn setup_test_data() -> (Vec<JSXElement>, u32) {
    let mut test_data: Vec<JSXElement> = vec![];
    let mut count = 0;

    for i in 1..150 {
        count += 1;
        let modulated_value = i % 50;
        let newId = "{i.to_string()}";
        let mut new_element: JSXElement = JSXElement::new(newId, "div", vec![], "Parent", "", "");

        if modulated_value == 0 {
            let result = create_inner_html(newId, 8);
            new_element.inner_html = result.0;
            count += result.1;
        }

        test_data.push(new_element);
    }

    return (test_data, count);
}

#[wasm_bindgen]
pub fn run() -> u32 {
    // Use `web_sys`'s global `window` function to get a handle on the global
    // window object.
    let window = web_sys::window().expect("no global `window` exists");
    let document = window.document().expect("should have a document on window");
    let body = document.body().expect("document should have a body");

    let data = setup_test_data();

    for elem in data.0.iter() {
        body.append_child(&render_element(window.document().unwrap(), &elem).unwrap());
    }

    return data.1;
}

fn render_element(
    document: web_sys::Document,
    element: &JSXElement,
) -> Result<web_sys::Element, wasm_bindgen::JsValue> {
    let val = document.create_element(&element.tag)?;

    if element.inner_html.len() > 0 {
        let window = web_sys::window().expect("no global `window` exists");
        for elem in element.inner_html.iter() {
            val.append_child(&render_element(window.document().unwrap(), &*elem).unwrap())?;
        }
    }

    if element.inner_html.len() == 0 {
        val.set_inner_html(element.text.as_ref().unwrap());
    }

    val.set_class_name(element.class.as_ref().unwrap());

    return Ok(val);
}
