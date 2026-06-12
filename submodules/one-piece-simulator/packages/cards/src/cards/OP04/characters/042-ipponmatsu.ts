import type { CharacterCard } from "@tcg/op-types";
import { op04Ipponmatsu042I18n } from "./042-ipponmatsu.i18n.ts";

export const op04Ipponmatsu042: CharacterCard = {
  id: "OP04-042",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP04",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "wisdom",
  effect:
    '[On Play] Up to 1 of your "Slash" attribute Characters gains +3000 power during this turn. Then, trash 1 card from the top of your deck.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op04Ipponmatsu042I18n,
};
