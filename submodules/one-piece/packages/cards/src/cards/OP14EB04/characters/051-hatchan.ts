import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Hatchan051I18n } from "./051-hatchan.i18n.ts";

export const op14eb04Hatchan051: CharacterCard = {
  id: "OP14-051",
  canonicalId: "OP14-051",
  slug: "hatchan/op14-051",
  name: "Hatchan",
  printings: [
    {
      id: "OP14-051",
      artId: "OP14-051",
      setCode: "OP14EB04",
      collectorNumber: "051",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-051_3M80AhK.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 1,
  power: 3000,
  traits: ["Fish-Man The Sun Pirates"],
  attribute: "slash",
  effect: "[DON!! x2] [On K.O.] Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op14eb04Hatchan051I18n,
};
