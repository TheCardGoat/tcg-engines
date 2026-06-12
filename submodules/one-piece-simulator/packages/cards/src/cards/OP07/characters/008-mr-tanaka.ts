import type { CharacterCard } from "@tcg/op-types";
import { op07MrTanaka008I18n } from "./008-mr-tanaka.i18n.ts";

export const op07MrTanaka008: CharacterCard = {
  id: "OP07-008",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP07",
  cost: 3,
  power: 3000,
  traits: ["FILM Grantesoro"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [Trigger] Play this card.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: op07MrTanaka008I18n,
};
