import type { CharacterCard } from "@tcg/op-types";
import { op07DraculeMihawk044I18n } from "./044-dracule-mihawk.i18n.ts";

export const op07DraculeMihawk044: CharacterCard = {
  id: "OP07-044",
  canonicalId: "OP07-044",
  slug: "dracule-mihawk/op07-044",
  name: "Dracule Mihawk",
  printings: [
    {
      id: "OP07-044",
      artId: "OP07-044",
      setCode: "OP07",
      collectorNumber: "044",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-044.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP07",
  cost: 8,
  power: 10000,
  traits: ["The Seven Warlords of the Sea"],
  attribute: "slash",
  effect: "[On Play] Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
  i18n: op07DraculeMihawk044I18n,
};
