import type { CharacterCard } from "@tcg/op-types";
import { op15RoronoaZoro113I18n } from "./op15-113-roronoa-zoro.i18n.ts";

export const op15RoronoaZoro113: CharacterCard = {
  id: "OP15-113",
  canonicalId: "OP15-113",
  slug: "roronoa-zoro/op15-113",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "OP15-113",
      artId: "OP15-113",
      setCode: "OP15",
      collectorNumber: "113",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-113_IoOASXf.jpg",
      label: "Roronoa Zoro (OP15-113)",
    },
    {
      id: "OP15-113_p1",
      artId: "OP15-113_p1",
      setCode: "OP15",
      collectorNumber: "113",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-113_p1_lSKJkzB.jpg",
      label: "Roronoa Zoro (OP15-113) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP15",
  cost: 4,
  power: 6000,
  traits: ["Straw Hat Crew Sky Island"],
  attribute: "slash",
  effect:
    "[On Play] You may trash 1 card from your hand: Add up to 1 card from the top of your deck to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op15RoronoaZoro113I18n,
};
