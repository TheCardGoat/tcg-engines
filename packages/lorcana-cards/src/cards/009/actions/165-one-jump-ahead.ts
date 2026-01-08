import type { ActionCard } from "@tcg/lorcana-types";

export const oneJumpAhead: ActionCard = {
  id: "1xl",
  cardType: "action",
  name: "One Jump Ahead",
  inkType: ["sapphire"],
  franchise: "Aladdin",
  set: "009",
  text: "Put the top card of your deck into your inkwell facedown and exerted.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 165,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "fbc3343ba157343b6f977e1486027bbe0b7ab1f7",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { oneJumpAhead as ogOneJumpAhead } from "@lorcanito/lorcana-engine/cards/001/songs/164-one-jump-ahead";
//
// export const oneJumpAhead: LorcanitoActionCard = {
//   ...ogOneJumpAhead,
//   id: "uhq",
//   reprints: [ogOneJumpAhead.id],
//   number: 165,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650099,
//   },
// };
//
