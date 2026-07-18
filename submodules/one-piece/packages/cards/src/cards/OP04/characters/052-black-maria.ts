import type { CharacterCard } from "@tcg/op-types";
import { op04BlackMaria052I18n } from "./052-black-maria.i18n.ts";

export const op04BlackMaria052: CharacterCard = {
  id: "OP04-052",
  canonicalId: "OP04-052",
  slug: "black-maria/op04-052",
  name: "Black Maria",
  printings: [
    {
      id: "OP04-052",
      artId: "OP04-052",
      setCode: "OP04",
      collectorNumber: "052",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-052.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP04",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "special",
  effect:
    "[Activate:Main] (2) (You may rest the specified number of DON!! cards in your cost area.) You may rest this Character: Draw 1 card. [Trigger] Play this card.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 2,
          },
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: op04BlackMaria052I18n,
};
