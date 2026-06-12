import type { CharacterCard } from "@tcg/op-types";
import { op01MsAllSunday079I18n } from "./079-ms-all-sunday.i18n.ts";

export const op01MsAllSunday079: CharacterCard = {
  id: "OP01-079",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP01",
  cost: 3,
  power: 1000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "strike",
  effect:
    '[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On K.O.] If your Leader has the "Baroque Works" type, add up to 1 Event from your trash to your hand.  This card has been officially errata\'d.',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Baroque Works",
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cardCategory",
                  value: "event",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op01MsAllSunday079I18n,
};
