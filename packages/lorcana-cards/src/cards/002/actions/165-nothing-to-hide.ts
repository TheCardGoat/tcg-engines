import type { ActionCard } from "@tcg/lorcana-types";

export const nothingToHide: ActionCard = {
  id: "1tm",
  cardType: "action",
  name: "Nothing to Hide",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "Each opponent reveals their hand. Draw a card.",
  cost: 1,
  cardNumber: 165,
  inkable: true,
  externalIds: {
    ravensburger: "eb38cba8fe1056601e3bcc7c466dba3649d7cb10",
  },
  abilities: [
    {
      id: "1tm-1",
      type: "action",
      effect: {
        type: "draw",
        amount: 1,
        target: "EACH_OPPONENT",
      },
      text: "Each opponent reveals their hand. Draw a card.",
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { opponentRevealHand } from "@lorcanito/lorcana-engine/effects/effects";
// import type { PlayerEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// const self: PlayerEffectTarget = {
//   type: "player",
//   value: "self",
// };
//
// export const nothingToHide: LorcanitoActionCard = {
//   id: "q9s",
//
//   name: "Nothing to Hide",
//   characteristics: ["action"],
//   text: "Each opponent reveals their hand. Draw a card.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Nothing to Hide",
//       text: "Each opponent reveals their hand. Draw a card.",
//       effects: [
//         {
//           type: "draw",
//           amount: 1,
//           target: self,
//         },
//         opponentRevealHand,
//       ],
//     },
//   ],
//   flavour: "Helps you avoid unpleasant surprises.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 1,
//   illustrator: "Mane Kandalyan / Jochem Van Gool",
//   number: 165,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 526744,
//   },
//   rarity: "common",
// };
//
