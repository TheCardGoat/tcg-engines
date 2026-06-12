import type { CharacterCard } from "@tcg/op-types";
import { op01BasilHawkins106I18n } from "./106-basil-hawkins.i18n.ts";

export const op01BasilHawkins106: CharacterCard = {
  id: "OP01-106",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP01",
  cost: 4,
  power: 2000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates Hawkins Pirates"],
  attribute: "slash",
  effect:
    "[On Play] Add up to 1 DON!! card from your DON!! deck and rest it. [Trigger] Play this card.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
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
  i18n: op01BasilHawkins106I18n,
};
