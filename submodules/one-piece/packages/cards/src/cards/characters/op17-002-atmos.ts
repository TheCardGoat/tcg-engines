import type { CharacterCard } from "@tcg/op-types";
import { op17Atmos002I18n } from "./op17-002-atmos.i18n.ts";

export const op17Atmos002: CharacterCard = {
  id: "OP17-002",
  canonicalId: "OP17-002",
  slug: "atmos/op17-002",
  name: "Atmos",
  printings: [
    {
      id: "OP17-002",
      artId: "OP17-002",
      setCode: "OP17",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-002_vdHKvw7.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP17",
  cost: 4,
  power: 6000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect: "[Opponent's Turn] This Character gains +3000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
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
            value: 3000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op17Atmos002I18n,
};
