import type { CharacterCard } from "@tcg/op-types";
import { op11TopknotNeptunian107I18n } from "./107-topknot-neptunian.i18n.ts";

export const op11TopknotNeptunian107: CharacterCard = {
  id: "OP11-107",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP11",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Neptunian"],
  attribute: "strike",
  effect:
    "[Blocker]\n[Activate: Main] [Once Per Turn] If your Leader is [Shirahoshi], you may turn 1 card from the top of your Life cards face-down: Set this Character as active at the end of this turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderName",
            name: "Shirahoshi",
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op11TopknotNeptunian107I18n,
};
