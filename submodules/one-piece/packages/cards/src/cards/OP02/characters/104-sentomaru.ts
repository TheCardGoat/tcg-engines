import type { CharacterCard } from "@tcg/op-types";
import { op02Sentomaru104I18n } from "./104-sentomaru.i18n.ts";

export const op02Sentomaru104: CharacterCard = {
  id: "OP02-104",
  canonicalId: "OP02-104",
  slug: "sentomaru/op02-104",
  name: "Sentomaru",
  printings: [
    {
      id: "OP02-104",
      artId: "OP02-104",
      setCode: "OP02",
      collectorNumber: "104",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-104.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP02",
  cost: 2,
  power: 3000,
  counter: 1000,
  trigger: "Play this card.",
  traits: ["Navy"],
  attribute: "slash",
  effect: "[Trigger] Play this card.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: op02Sentomaru104I18n,
};
