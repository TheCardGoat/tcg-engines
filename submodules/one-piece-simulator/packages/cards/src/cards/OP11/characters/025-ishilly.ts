import type { CharacterCard } from "@tcg/op-types";
import { op11Ishilly025I18n } from "./025-ishilly.i18n.ts";

export const op11Ishilly025: CharacterCard = {
  id: "OP11-025",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP11",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Merfolk Fish-Man Island"],
  attribute: "wisdom",
  effect:
    "[On Your Opponent's Attack] [Once Per Turn] You may rest 1 of your DON!! cards and this Character: Up to 1 of your Leader or Character cards gains +1000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisBattle",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op11Ishilly025I18n,
};
