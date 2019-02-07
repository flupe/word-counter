import * as WC from './lib.js'

const $ = document.getElementById.bind(document)
const textarea = $('textarea')
const counter  = $('word-counter')

function compute() {
  let txt   = textarea.value
  let count = WC.countWords(txt)
  counter.innerText = count
}

fetch('./dict.txt')
  .then(function(response) {
    let reader = response.body.getReader()
    let decoder = new TextDecoder('utf-8')
    let queue = ''

    reader.read().then(function processDict({ done, value }) {
      if (done) {
        WC.setDictUsage(true)
        $('loading').remove()
        compute()
        return
      }

      let txt = queue + decoder.decode(new Uint8Array(value))
      let p = 0

      for (let i = 0, c = txt.length; i < c; i++) {
        if (txt[i] == '\n') {
          WC.dict.add(txt.substring(p, i))
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
