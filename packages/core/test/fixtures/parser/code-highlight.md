---
models:
  "Custom-Note-Model":
    inOrderFields:
      - Front
      - Back
    templates:
      "CardName 1":
        Front: "front 1 {{Front}}"
        Back: "back 1 {{Back}} {{Extra}}"
      "CardName 2":
        Front: "front 2 {{Front}} {{Extra}}"
        Back: "back 2 {{Back}}"
    highlight: dark
    css: |
      // frontmatter css
---

# #card bash without language

```
ls dir
echo "xxx" > /dev/null
```

# #card bash with language

```bash
ls dir
echo "xxx" > /dev/null
```

# #card-Custom-Note-Model with @Anki.md injected highlight css

## #Front

## #Back

```bash
ls dir
echo "xxx" > /dev/null
```
