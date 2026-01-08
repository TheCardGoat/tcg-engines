import type { ActionCard } from "@tcg/lorcana-types";

export const youreWelcome: ActionCard = {
  id: "1my",
  cardType: "action",
  name: "You're Welcome",
  inkType: ["emerald"],
  franchise: "Moana",
  set: "005",
  text: "Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.",
  actionSubtype: "song",
  cost: 4,
  cardNumber: 96,
  inkable: true,
  externalIds: {
    ravensburger: "d1b38a28131ef676d9daa53b83ce02ff56acc2bc",
  },
  abilities: [
    {
      id: "1my-1",
      type: "action",
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
      text: "Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.",
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   LorcanitoActionCard,
//   TargetCardEffect,
// } from "@lorcanito/lorcana-engine";
// import { chosenCharacterItemOrLocation } from "@lorcanito/lorcana-engine/abilities/target";
// import { drawXCards } from "@lorcanito/lorcana-engine/effects/effects";
//
// const youreWelcomeEffect: TargetCardEffect = {
//   // TODO: REVISIT THIS, this is hacky
//   type: "from-target-card-to-target-player",
//   player: "card-owner",
//   target: chosenCharacterItemOrLocation,
//   effects: [
//     {
//       // @ts-expect-error the effect should only contain player effects
//       type: "shuffle",
//       target: chosenCharacterItemOrLocation,
//     },
//     drawXCards(2),
//   ],
// };
//
// export const youreWelcome: LorcanitoActionCard = {
//   id: "tri",
//   name: "You're Welcome",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 4 or more can {E} to sing this song for free.)_<br>\nShuffle chosen character, item, or location into their player's deck. That player draws 2 cards.",
//   type: "action",
//   abilities: [
//     {
//       name: "Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.",
//       type: "resolution",
//       effects: [youreWelcomeEffect],
//     },
//   ],
//   flavour: "I make everything happen!",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   illustrator: "César Vergara",
//   number: 96,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 555274,
//   },
//   rarity: "uncommon",
// };
//
