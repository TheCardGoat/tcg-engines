import type { CharacterCard } from "@tcg/op-types";
import { op03YosakuJohnny053I18n } from "./053-yosaku-johnny.i18n.ts";

export const op03YosakuJohnny053: CharacterCard = {
  id: "OP03-053",
  canonicalId: "OP03-053",
  slug: "yosaku-johnny",
  name: "Yosaku & Johnny",
  printings: [
    {
      id: "OP03-053",
      artId: "OP03-053",
      setCode: "OP03",
      collectorNumber: "053",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-053.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP03",
  cost: 1,
  power: 3000,
  traits: ["East Blue"],
  attribute: "slash",
  effect: "[DON!! x1] If you have 20 or less cards in your deck, this Character gains +2000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "zoneCount",
            player: "self",
            zone: "deck",
            comparison: "lte",
            value: 20,
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
  i18n: op03YosakuJohnny053I18n,
};
