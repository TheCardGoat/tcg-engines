import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Igaram021I18n } from "./021-igaram.i18n.ts";

export const op14eb04Igaram021: CharacterCard = {
  id: "EB04-021",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Alabasta"],
  attribute: "wisdom",
  effect:
    "[On Play] If your Leader is [Nefeltari Vivi], draw 2 cards and trash 1 card from your hand.\n[Activate: Main] [Once Per Turn] You may trash 1 card from your hand: Give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderName",
            name: "Nefeltari Vivi",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04Igaram021I18n,
};
