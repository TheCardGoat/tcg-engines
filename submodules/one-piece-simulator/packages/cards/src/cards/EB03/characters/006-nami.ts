import type { CharacterCard } from "@tcg/op-types";
import { eb03Nami006I18n } from "./006-nami.i18n.ts";

export const eb03Nami006: CharacterCard = {
  id: "EB03-006",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "EB03",
  cost: 5,
  power: 7000,
  traits: ["Alabasta Straw Hat Crew"],
  attribute: "wisdom",
  effect:
    "[On Play] You may give your active Leader 5000 power during this turn: Draw 1 card.\n[Activate: Main] [Once Per Turn] If your Leader has the {Alabasta} type, give up to 1 of your opponent's Characters 1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Alabasta",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb03Nami006I18n,
};
