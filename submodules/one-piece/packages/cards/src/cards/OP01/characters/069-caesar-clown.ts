import type { CharacterCard } from "@tcg/op-types";
import { op01CaesarClown069I18n } from "./069-caesar-clown.i18n.ts";

export const op01CaesarClown069: CharacterCard = {
  id: "OP01-069",
  canonicalId: "OP01-069",
  slug: "caesar-clown/op01-069",
  name: "Caesar Clown",
  printings: [
    {
      id: "OP01-069",
      artId: "OP01-069",
      setCode: "OP01",
      collectorNumber: "069",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-069.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP01",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Punk Hazard Scientist"],
  attribute: "special",
  effect:
    "[On K.O.] Play up to 1 [Smiley] from your deck, then shuffle your deck.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "deck",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "name",
                value: "Smiley",
              },
            ],
          },
          {
            action: "shuffleDeck",
            player: "self",
          },
        ],
      },
    ],
  },
  i18n: op01CaesarClown069I18n,
};
