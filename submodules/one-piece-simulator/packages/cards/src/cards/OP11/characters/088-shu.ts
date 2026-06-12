import type { CharacterCard } from "@tcg/op-types";
import { op11Shu088I18n } from "./088-shu.i18n.ts";

export const op11Shu088: CharacterCard = {
  id: "OP11-088",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP11",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[Once Per Turn] This effect can be activated when your opponent's Character attacks. If that Character has the (Slash) attribute, this Character gains +5000 power during this battle.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onOpponentAttack",
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
            value: 5000,
            duration: "thisBattle",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op11Shu088I18n,
};
