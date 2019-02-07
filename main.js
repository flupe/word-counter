const $ = document.getElementById.bind(document)
const textarea = $('textarea')
const counter  = $('word-counter')

let useDict      = false
let isWhiteSpace = x => ' \t\n\r\v\xa0'.indexOf(x) > -1
let isValid      = w => useDict ? check(w) : w != 't'

const dict = {}

function check(word) {
  let tree = dict
  for (let i = 0, c = word.length; i < c; i++) {
    let x = word[i]
    if (!(tree = tree[x])) return false
  }
  return tree.$ || false
}

// TODO: fix this only for french valid chars?
let isSymbol     = x => {
  let c = x.charCodeAt(0)
  return !((48  <= c && c <= 57 )   // decimals
         ||(65  <= c && c <= 90 )   // uppercase
         ||(97  <= c && c <= 122)   // lowercase
         ||(192 <= c && c <= 246))  // extended 1
}

let elided = 'cdjlmnst'.split('')

function countWords(txt) {
  let i = 0 // current position
  let p = 0 // current word beginning position
  let count = 0
  let length = txt.length

  let composed = false
  let composed_counted = false

  let word = () => txt.substring(p, i)

  while (i < length) {
    let c = txt[i]

    if (isWhiteSpace(c)) {
      // whitespace is at the end of a word
      if ((p < i && !composed || isValid(word())) || (composed && !composed_counted)) {
        count++
      }

      while (isWhiteSpace(txt[++i])) {}

      composed = false
      composed_counted = false

      p = i
      continue
    }

    // elided words
    if (c == "'" && elided.includes(word())) {
      count++
      p = ++i
      continue
    }

    // composed words
    if (c == '-') {
      composed = true
      if (p < i) {
        // a word is counted only if it has meaning when isolated
        if (isValid(word())) {
          count++
          composed_counted = true
        }
        p = ++i
      }
      continue
    }

    // isolated symbols are skipped
    if (isSymbol(c) && p == i) {
      p = ++i
      continue
    }

    i++
  }

  if ((p < i && (!composed || isValid(word()))) || (composed && !composed_counted)) count++

  return count
}

function compute() {
  let txt   = textarea.value
  let count = countWords(txt)
  counter.innerText = count
}

fetch('./dict.txt')
  .then(function(response) {
    let reader = response.body.getReader()
    let decoder = new TextDecoder('utf-8')
    let tree = dict

    reader.read().then(function processDict({ done, value }) {
      if (done) {
        useDict = true
        $('loading').remove()
        compute()
        return
      }

      let txt = decoder.decode(new Uint8Array(value))

      for (let i = 0, c = txt.length; i < c; i++) {
        if (txt[i] == '\n') {
          tree.$ = true
          tree = dict
        }
        else {
          let x = txt[i]
          if (!tree[x]) tree[x] = {}
          tree = tree[x]
        }
      }

      return reader.read().then(processDict)
    })
  })

  .catch(function(e) {
    console.error('Une erreur est survenue pendant le chargement du dictionnaire.')
    console.log(e)
  })

textarea.addEventListener('input', compute, false)

compute()
