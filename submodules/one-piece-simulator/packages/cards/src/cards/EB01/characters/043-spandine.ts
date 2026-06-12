import type { CharacterCard } from "@tcg/op-types";
import { eb01Spandine043I18n } from "./043-spandine.i18n.ts";

export const eb01Spandine043: CharacterCard = {
  id: "EB01-043",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "EB01",
  cost: 3,
  power: 2000,
  counter: 1000,
  traits: ["CP9"],
  attribute: "wisdom",
  effect:
    '[On Play] You may place 3 cards with a type including "CP" from your trash at the bottom of your deck in any order: Play up to 1 Character card with a type including "CP" and a cost of 4 or less other than [Spandine] from your trash rested.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "excludeName",
                value: "Spandine",
              },
            ],
            playState: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb01Spandine043I18n,
};
