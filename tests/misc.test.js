import { countWords } from '../lib'

test('Mots contractés et voyelles élidées comptabilisés', () => {
  expect(countWords(`C'est faux.`)).toBe(3)
  expect(countWords(`n'est`)).toBe(2)
  expect(countWords(`Je n'aime pas ça`)).toBe(5)
  expect(countWords(`L'homme`)).toBe(2)
})

test('Lettres euphoniques ignorées', () => {
  expect(countWords(`Où va-t-il ?`)).toBe(3)
  expect(countWords(`N'y a-t-il pas de place ?`)).toBe(7)
  expect(countWords(`Que l'on fasse`)).toBe(3)
})

test('Ponctuation ignorée', () => {
  expect(countWords(`. . .  ! ??`)).toBe(0)
  expect(countWords(`Conclusion: ça a l'air de marcher.`)).toBe(7)
})

test('Symboles ignorés', () => {
  expect(countWords(`@<> ()`)).toBe(0)
  expect(countWords(`Il semblerait - en tout cas.`)).toBe(5)
})

test('Espaces ignorés', () => {
  expect(countWords(`\t   \r\n`)).toBe(0)
  expect(countWords(`Un  \t  deux
  \r \r
  trois`)).toBe(3)
})
