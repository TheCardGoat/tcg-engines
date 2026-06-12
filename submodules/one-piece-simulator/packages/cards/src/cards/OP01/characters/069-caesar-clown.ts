import type { CharacterCard } from "@tcg/op-types";
import { op01CaesarClown069I18n } from "./069-caesar-clown.i18n.ts";

export const op01CaesarClown069: CharacterCard = {
  id: "OP01-069",
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
        ],
      },
    ],
  },
  i18n: op01CaesarClown069I18n,
};
