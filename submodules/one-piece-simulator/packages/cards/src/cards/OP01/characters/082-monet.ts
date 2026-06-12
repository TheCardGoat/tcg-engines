import type { CharacterCard } from "@tcg/op-types";
import { op01Monet082I18n } from "./082-monet.i18n.ts";

export const op01Monet082: CharacterCard = {
  id: "OP01-082",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP01",
  cost: 2,
  power: 3000,
  counter: 1000,
  trigger: "Play this card.",
  traits: ["Donquixote Pirates Punk Hazard"],
  attribute: "special",
  effect: "[Trigger] Play this card.",
  effects: {
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
  i18n: op01Monet082I18n,
};
