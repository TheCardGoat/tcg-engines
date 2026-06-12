import type { EventCard } from "@tcg/op-types";
import { eb02WithoutYourHelpICanTBecomeTheKingOfThePirates059I18n } from "./059-without-your-help-i-can-t-become-the-king-of-the-pirates.i18n.ts";

export const eb02WithoutYourHelpICanTBecomeTheKingOfThePirates059: EventCard = {
  id: "EB02-059",
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "EB02",
  cost: 4,
  traits: ["Straw Hat Crew"],
  effect:
    '[Counter] Up to 1 of your Leader or Character cards gains +1000 power during this battle. Then, if you have 1 or less Life cards, play up to 1 of your yellow "Straw Hat Crew" type Character cards or [Sanji] with a cost of 5 or less from your hand.',
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: eb02WithoutYourHelpICanTBecomeTheKingOfThePirates059I18n,
};
