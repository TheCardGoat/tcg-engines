import type { CharacterCard } from "@tcg/op-types";
import { op17Rodo094I18n } from "./op17-094-rodo.i18n.ts";

export const op17Rodo094: CharacterCard = {
  id: "OP17-094",
  canonicalId: "OP17-094",
  slug: "rodo/op17-094",
  name: "Rodo",
  printings: [
    {
      id: "OP17-094",
      artId: "OP17-094",
      setCode: "OP17",
      collectorNumber: "094",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-094_vLuXNgL.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP17",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Giant Elbaph New Giant Pirates"],
  attribute: "slash",
  effect: "If your Leader has the {Elbaph} type, this Character gains +12 cost.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Elbaph",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 12,
          },
        ],
      },
    ],
  },
  i18n: op17Rodo094I18n,
};
