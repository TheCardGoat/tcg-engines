import type { CharacterCard } from "@tcg/op-types";
import { op12Pacifista109I18n } from "./109-pacifista.i18n.ts";

export const op12Pacifista109: CharacterCard = {
  id: "OP12-109",
  canonicalId: "OP12-109",
  slug: "pacifista/op12-109",
  name: "Pacifista",
  printings: [
    {
      id: "OP12-109",
      artId: "OP12-109",
      setCode: "OP12",
      collectorNumber: "109",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-109_OBz9b2q.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP12",
  cost: 4,
  power: 5000,
  counter: 1000,
  trigger:
    "K.O. up to 1 of your opponent's Characters with a cost of 1 or less and add this card to your hand.",
  traits: ["Biological Weapon Navy Egghead"],
  attribute: "special",
  effect:
    "[Trigger] K.O. up to 1 of your opponent's Characters with a cost of 1 or less and add this card to your hand.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "cost", comparison: "lte", value: 1 }],
            },
          },
          {
            action: "addThisCardToHand",
          },
        ],
      },
    ],
  },
  i18n: op12Pacifista109I18n,
};
