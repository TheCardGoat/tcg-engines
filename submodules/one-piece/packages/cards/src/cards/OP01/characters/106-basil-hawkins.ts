import type { CharacterCard } from "@tcg/op-types";
import { op01BasilHawkins106I18n } from "./106-basil-hawkins.i18n.ts";

export const op01BasilHawkins106: CharacterCard = {
  id: "OP01-106",
  canonicalId: "OP01-106",
  slug: "basil-hawkins/op01-106",
  name: "Basil Hawkins",
  printings: [
    {
      id: "OP01-106",
      artId: "OP01-106",
      setCode: "OP01",
      collectorNumber: "106",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-106.jpg",
    },
  ],
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
            self: true,
          },
        ],
      },
    ],
  },
  i18n: op01BasilHawkins106I18n,
};
