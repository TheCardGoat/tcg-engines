import type { CharacterCard } from "@tcg/op-types";
import { op07NicoRobin104I18n } from "./104-nico-robin.i18n.ts";

export const op07NicoRobin104: CharacterCard = {
  id: "OP07-104",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP07",
  cost: 3,
  power: 4000,
  counter: 1000,
  trigger: "If your Leader has the {Egghead} type, draw 2 cards.",
  traits: ["Straw Hat Crew Egghead"],
  attribute: "special",
  effect: "[Trigger] If your Leader has the {Egghead} type, draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Egghead",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op07NicoRobin104I18n,
};
