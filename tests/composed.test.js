import { dict, setDictUsage, countWords } from '../lib'

test('Mots composés hors dictionnaire', () => {
  expect(countWords(`cerf-volant`)).toBe(2)
})
