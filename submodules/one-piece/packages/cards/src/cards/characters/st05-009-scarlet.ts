import type { CharacterCard } from "@tcg/op-types";
import { st05Scarlet009I18n } from "./st05-009-scarlet.i18n.ts";

export const st05Scarlet009: CharacterCard = {
  id: "ST05-009",
  canonicalId: "ST05-009",
  slug: "scarlet/st05-009",
  name: "Scarlet",
  printings: [
    {
      id: "ST05-009",
      artId: "ST05-009",
      setCode: "ST05",
      collectorNumber: "009",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST05-009.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST05",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["FILM", "Animal", "Golden Lion Pirates"],
  attribute: "strike",
  trigger: "Play this card.",
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
  i18n: st05Scarlet009I18n,
};
