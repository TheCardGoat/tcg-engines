import type { CharacterCard } from "@tcg/op-types";
import { op17Streusen050I18n } from "./op17-050-streusen.i18n.ts";

export const op17Streusen050: CharacterCard = {
  id: "OP17-050",
  canonicalId: "OP17-050",
  slug: "streusen/op17-050",
  name: "Streusen",
  printings: [
    {
      id: "OP17-050",
      artId: "OP17-050",
      setCode: "OP17",
      collectorNumber: "050",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-050_tL3Nmmf.jpg",
      label: "Streusen (050)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP17",
  cost: 1,
  power: 2000,
  traits: ["Rocks Pirates"],
  attribute: "slash",
  effect:
    "[On Play] Look at 2 cards from the top of your deck, reorganize them in any order and place them at the top or bottom of your deck. Then, draw 1 card.",
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
  i18n: op17Streusen050I18n,
};
