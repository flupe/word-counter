const $ = document.getElementById.bind(document)
const textarea = $('textarea')
const counter  = $('word-counter')

let isWhiteSpace = x => ' \t\n\r\v'.indexOf(x) > -1

// TODO: fix this only for french valid chars?
let isSymbol     = x => {
  let c = x.charCodeAt(0)
  return !((48 <= c && c <= 57)    // decimals
         ||(65 <= c && c <= 90)    // uppercase
         ||(97 <= c && c <= 122)   // lowercase
         ||(192 <= c && c <= 246))  // extended 1
}

let elided = 'cdjlmnst'.split('')

function countWords(txt) {
  let i = 0 // current position
  let p = 0 // current word beginning position
  let count = 0
  let length = txt.length

  while (i < length) {
    let c = txt[i]

    if (isWhiteSpace(c)) {
      // whitespace is at the end of a word
      if (p < i) count++
      while (isWhiteSpace(txt[++i])) {}
      p = i
      continue
    }

    // elided words
    if (c == "'" && elided.includes(txt.substring(p, i))) {
      console.log(i, txt.substring(p, i))
      count++
      p = ++i
      continue
    }

    // TODO: check if word is valid on its own before counting it
    //       this means we need an efficient way to check the entire dictionnary
    if (c == '-') {
      if (p < i) {
        p = ++i
        count++
      }
      continue
    }

    // isolated symbols are skipped
    if (isSymbol(c) && p == i) {
      p = ++i
      continue
    }

    // mots
    i++
  }

  if (p < i) count++

  return count
}

function compute() {
  let txt   = textarea.value
  let count = countWords(txt)
  counter.innerText = count
}

textarea.addEventListener('input', compute, false)

compute()
