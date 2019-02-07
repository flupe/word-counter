// TODO: cleanup
// TODO: process word, pages, libreoffice files

const $ = document.getElementById.bind(document)
const textarea = $('textarea')
const counter  = $('word-counter')

const dict = new Set()
let useDict = false

function check(word) {
  return dict.has(word)
}

let whitespace = ' \t\n\r\v\xa0'.split('')
// TODO: should we count `quelqu'`?
let elided     = 'cdjlmnst'.split('')

let isElided     = x => elided.includes(x.toLowerCase())
let isWhitespace = x => whitespace.includes(x)
let isValid      = w => useDict ? check(w.toLowerCase()) : w != 't'

// TODO: fix this only for french valid chars?
let isSymbol     = x => {
  if (!x) return true
  let c = x.charCodeAt(0)
  return !((48  <= c && c <= 57 )   // decimals
         ||(65  <= c && c <= 90 )   // uppercase
         ||(97  <= c && c <= 122)   // lowercase
         ||(192 <= c && c <= 246))  // extended 1
}

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

    if (isWhitespace(c)) {
      // whitespace is at the end of a word
      if (p < i) {
        if (!composed || composed && isValid(word())) count++
      }
      else if (composed && !composed_counted) count++

      while (++i < length && isWhitespace(txt[i]));
      composed = false
      composed_counted = false
      p = i
      continue
    }

    // elided words
    if (c == "'") {
      if (word().toLowerCase() == 'l') {
        let [o, n, _] = txt.substr(i+1, 3).toLowerCase()
        if (o == 'o' && n == 'n' && isSymbol(_)) {
          p = ++i
          continue
        }
      }

      if (isElided(word())) {
        count++
        p = ++i
        continue
      }
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
    if (isSymbol(c)) {
      if (composed && isValid(word())) {
        count++
        composed_counted = true
        p = ++i
        continue
      }
      else if (p == i) {
        p = ++i
        continue
      }
    }

    i++
  }

  if ((p < i && (!composed || (composed && isValid(word())))) || (composed && !composed_counted)) count++

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
    // let tree = dict
    let queue = ''

    reader.read().then(function processDict({ done, value }) {
      if (done) {
        useDict = true
        $('loading').remove()
        compute()
        return
      }

      let txt = queue + decoder.decode(new Uint8Array(value))
      let p = 0

      for (let i = 0, c = txt.length; i < c; i++) {
        if (txt[i] == '\n') {
          dict.add(txt.substring(p, i))
          p = i + 1
        }
      }

      queue = txt.substring(p)

      return reader.read().then(processDict)
    })
  })

  .catch(function(e) {
    console.error('Une erreur est survenue pendant le chargement du dictionnaire.')
    console.log(e)
  })

textarea.addEventListener('input', compute, false)

compute()
