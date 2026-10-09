import type { CharacterCard } from "@tcg/op-types";
import { pKaido005I18n } from "./p-005-kaido.i18n.ts";
export const pKaido005: CharacterCard = {
  id: "P-005",
  canonicalId: "P-005",
  slug: "kaido/p-005",
  name: "Kaido",
  printings: [
    {
      id: "P-005",
      artId: "P-005",
      setCode: "P",
      collectorNumber: "005",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-005.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "P",
  setId: "P",
  cost: 7,
  power: 8000,
  traits: ["The Four Emperors", "Animal Kingdom Pirates"],
  attribute: "strike",
  effect:
    "[Activate: Main] DON!! −2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): This Character gains [Banish] during this turn. (When this card deals damage, the target card is trashed without activating its Trigger.)",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "banish",
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: pKaido005I18n,
};
