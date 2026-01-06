import type { ActionCard } from "@tcg/lorcana-types/cards/card-types";

export const beOurGuest: ActionCard = {
  id: "m6n",
  cardType: "action",
  name: "Be Our Guest",
  version: "",
  fullName: "Be Our Guest",
  inkType: [
    "amber",
  ],
  franchise: "General",
  set: "001",
  text: "_(A character with cost 2 or more can {E} to sing thissong for free.)_
Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  cost: 2,
  cardNumber: 25,
  inkable: true,
  rarity: "uncommon",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 494110,
  },
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
          type: "look-at-cards",
          amount: 4,
          from: "top-of-deck",
          target: "CONTROLLER",
          then: {
            action: "put-on-bottom",
          },
        },
      id: "m6n-1",
      text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
};
