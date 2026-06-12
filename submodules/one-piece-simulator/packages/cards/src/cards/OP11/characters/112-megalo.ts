import type { CharacterCard } from "@tcg/op-types";
import { op11Megalo112I18n } from "./112-megalo.i18n.ts";

export const op11Megalo112: CharacterCard = {
  id: "OP11-112",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP11",
  cost: 3,
  power: 2000,
  counter: 1000,
  traits: ["Animal Fish-Man Island"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[Opponent's Turn] If your Leader is [Shirahoshi], this Character gains +4000 power.",
  effects: {
    keywords: ["blocker"],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
          {
            condition: "leaderName",
            name: "Shirahoshi",
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
            value: 4000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op11Megalo112I18n,
};
