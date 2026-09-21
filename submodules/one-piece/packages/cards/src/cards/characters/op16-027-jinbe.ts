import type { CharacterCard } from "@tcg/op-types";
import { op16Jinbe027I18n } from "./op16-027-jinbe.i18n.ts";

export const op16Jinbe027: CharacterCard = {
  id: "OP16-027",
  canonicalId: "OP16-027",
  slug: "jinbe/op16-027",
  name: "Jinbe",
  printings: [
    {
      id: "OP16-027",
      artId: "OP16-027",
      setCode: "OP16",
      collectorNumber: "027",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-027_FoA9ykm.jpg",
      label: "Jinbe (027)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP16",
  cost: 2,
  power: 2000,
  counter: 2000,
  traits: ["Fish-Man The Sun Pirates Impel Down"],
  attribute: "strike",
  effect: "[DON!! X1] This Character gains +2000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op16Jinbe027I18n,
};
