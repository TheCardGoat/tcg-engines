import type { CharacterCard } from "@tcg/op-types";
import { op10CharlottePuddingSp012I18n } from "./012-charlotte-pudding-sp.i18n.ts";

export const op10CharlottePuddingSp012: CharacterCard = {
  id: "ST12-012",
  canonicalId: "ST12-012",
  slug: "charlotte-pudding-sp/st12-012",
  name: "Charlotte Pudding (SP)",
  printings: [
    {
      id: "ST12-012",
      artId: "ST12-012",
      setCode: "OP10",
      collectorNumber: "012",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST12-012_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP10",
  cost: 2,
  power: 2000,
  counter: 2000,
  traits: ["Big Mom Pirates"],
  attribute: "wisdom",
  effect: "[Activate: Main] Return this Character to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
      },
    ],
  },
  i18n: op10CharlottePuddingSp012I18n,
};
