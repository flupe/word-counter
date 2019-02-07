Outil pour compter le nombre de mots d'un texte français.
Il respecte les règles suivantes :

## Mots contractés et voyelles élidées

Comptent pour un mot. Exemples :
- `C'est faux` (3 mots)
- `Je n'aime pas ça` (5 mots)

## Lettres euphoniques

Les lettres euphoniques ne sont pas considérées comme des mots.

Exemples :
- `Où va-t-il ?` (3 mots)
- `N'y a-t-il pas de place ?` (7 mots)

Attention : Le `l` euphonique n'est pas encore pris en compte. Ainsi, 'que l'on fasse` comptera pour 4 mots en lieu et place des 3 attendus.

## Mots composés

Chaque fragment d'un mot composé est comptabilisé s'il a du sens en étant isolé.

Exemples :
- `Cerf-volant` (2 mots)
- `C'est-à-dire` (4 mots)
- `Socio-économique` (1 mot)
- `Spatio-temporel` (1 mot)

## Ponctuation

Les signes de ponctuation ne comptent pas.
