import type { CharacterCard } from "@tcg/op-types";
import { op01Kawamatsu037I18n } from "./037-kawamatsu.i18n.ts";

export const op01Kawamatsu037: CharacterCard = {
  id: "OP01-037",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP01",
  cost: 2,
  power: 3000,
  counter: 1000,
  trigger: "Play this card.",
  traits: ["Fish-Man Land of Wano The Akazaya Nine"],
  attribute: "slash",
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
  i18n: op01Kawamatsu037I18n,
};
