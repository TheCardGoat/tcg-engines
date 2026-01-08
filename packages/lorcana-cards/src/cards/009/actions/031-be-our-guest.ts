import type { ActionCard } from "@tcg/lorcana-types";

export const beOurGuest: ActionCard = {
  id: "wnp",
  cardType: "action",
  name: "Be Our Guest",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "009",
  text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 31,
  inkable: true,
  externalIds: {
    ravensburger: "75b3d826dbb7634142ce2c3a3fe0bab654ec37d0",
  },
  abilities: [
    {
      id: "wnp-1",
      text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      name: "Be Our Guest",
      type: "action",
      effect: {
        type: "look-at-cards",
        amount: 4,
        from: "top-of-deck",
        target: "CONTROLLER",
        then: {
          action: "put-in-hand",
          filter: {
            type: "card-type",
            cardType: "character",
          },
        },
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { beOurGuest as ogBeOurGuest } from "@lorcanito/lorcana-engine/cards/001/songs/025-be-our-guest";
//
// export const beOurGuest: LorcanitoActionCard = {
//   ...ogBeOurGuest,
//   id: "cwb",
//   reprints: [ogBeOurGuest.id],
//   number: 31,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649978,
//   },
// };
//
