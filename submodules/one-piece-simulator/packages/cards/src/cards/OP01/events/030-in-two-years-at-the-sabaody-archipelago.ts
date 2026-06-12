import type { EventCard } from "@tcg/op-types";
import { op01InTwoYearsAtTheSabaodyArchipelago030I18n } from "./030-in-two-years-at-the-sabaody-archipelago.i18n.ts";

export const op01InTwoYearsAtTheSabaodyArchipelago030: EventCard = {
  id: "OP01-030",
  cardType: "event",
  color: ["red"],
  rarity: "UC",
  setId: "OP01",
  cost: 1,
  traits: ["Straw Hat Crew"],
  effect:
    "[Main] Look at 5 cards from the top of your deck; reveal up to 1 \"Straw Hat Crew\" type Character card and add it to your hand. Then, place the rest at the bottom of your deck in any order. [Trigger] Activate this card's [Main] effect.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "trait",
                value: "Straw Hat Crew",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "main",
          },
        ],
      },
    ],
  },
  i18n: op01InTwoYearsAtTheSabaodyArchipelago030I18n,
};
