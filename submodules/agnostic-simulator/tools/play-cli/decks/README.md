# play-cli decks

## `meta/`

Live tournament decklists fetched from [Limitless One Piece](https://onepiece.limitlesstcg.com/decks) (OP16 format, 2026-07-30):

| Meta rank | Archetype               | Source list     |
| --------- | ----------------------- | --------------- |
| 1         | Blue/Yellow Nami        | decks/list/6738 |
| 2         | Purple Enel             | decks/list/6739 |
| 3         | Green/Blue Luffy        | decks/list/6697 |
| 4         | Black/Yellow Blackbeard | decks/list/6761 |
| 5         | Purple/Yellow Rosinante | decks/list/6717 |

Many OP15/OP16 printings are not yet in `@tcg/op-cards` (see `meta-validation.json`).

## `playable/`

Engine-legal 50-card archetype decks (`TEST_DECKS`) used for headless bot series.
`playable/index.json` maps each meta archetype to a playable stand-in.

## CLI

```sh
pnpm play-cli series --game one-piece --series 10 --best-of 3 \
  --p1-deck red-aggro --p2-deck blue-control --p1 first-legal --p2 first-legal
```
