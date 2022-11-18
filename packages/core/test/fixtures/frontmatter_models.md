---
models:
  "Custom Note Model":
    inOrderFields:
      - Front
      - Back
      - Extra
    cardTemplates:
      - Name: "CardName 1"
        Front: "front 1 {{Front}}"
        Back: "back 1 {{Back}} {{Extra}}"
      - Name: "CardName 2"
        Front: "front 2 {{Front}} {{Extra}}"
        Back: "back 2 {{Back}}"
    css: ""

  "Second Custom Note Model":
    css: "custom css"
    inOrderFields:
      - Field1
      - Field2
      - Field3
    cardTemplates:
      - Name: "CardName 1"
        Front: "front 1 {{Field1}}"
        Back: "back 1 {{Field2}} {{Field3}}"
      - Name: "CardName 2"
        Front: "front 2 {{Field1}} {{Field2}}"
        Back: "back 2 {{Field3}}"
---

Ignored