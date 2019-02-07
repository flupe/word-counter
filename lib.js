// TODO: process word, pages, libreoffice files

export { dict, setDictUsage, countWords }

const dict  = new Set()
let useDict = false
const check = word => dict.has(word)
const setDictUsage = state => useDict = state

let whitespace = ' \t\n\r\v\xa0'.split('')
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
    if (c == '-' && p < i) {
      composed = true
      // a word is counted only if it has meaning when isolated
      if (isValid(word())) {
        count++
        composed_counted = true
      }
      p = ++i
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

