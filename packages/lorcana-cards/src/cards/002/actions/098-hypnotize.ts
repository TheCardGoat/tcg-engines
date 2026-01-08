import type { ActionCard } from "@tcg/lorcana-types";

export const hypnotize: ActionCard = {
  id: "1kn",
  cardType: "action",
  name: "Hypnotize",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "002",
  text: "Each opponent chooses and discards a card. Draw a card.",
  cost: 3,
  cardNumber: 98,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cbba562b84a9e94b1f0e30aceba74976a88608a3",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { discardACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// const self = {
//   type: "player" as const,
//   value: "self" as const,
// };
//
// export const hypnotize: LorcanitoActionCard = {
//   id: "awj",
//   name: "Hypnotize",
//   characteristics: ["action"],
//   text: "Each opponent chooses and discards a card. Draw a card.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       optional: false,
//       responder: "opponent",
//       effects: [discardACard],
//     },
//     {
//       type: "resolution",
//       optional: false,
//       effects: [{ type: "draw", amount: 1, target: self }],
//     },
//   ],
//   flavour: "Look me in the eye when I'm speaking to you.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   illustrator: "Lauren Levering",
//   number: 98,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 518790,
//   },
//   rarity: "common",
// };
//
