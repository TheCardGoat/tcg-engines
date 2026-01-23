import type { LocationCard } from "@tcg/lorcana-types";

export const merlinsCottageTheWizardsHome: LocationCard = {
  id: "1fe",
  cardType: "location",
  name: "Merlin's Cottage",
  version: "The Wizard's Home",
  fullName: "Merlin's Cottage - The Wizard's Home",
  inkType: ["sapphire"],
  franchise: "Sword in the Stone",
  set: "005",
  text: "KNOWLEDGE IS POWER Each player plays with the top card of their deck face up.",
  cost: 1,
  moveCost: 1,
  lore: 0,
  cardNumber: 170,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b8c3e0fa48f7dd83d249333474e56e59bc3fc146",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
//
// export const merlinsCottageTheWizardsHome: LorcanitoLocationCard = {
//   id: "d3u",
//   name: "Merlin's Cottage",
//   title: "The Wizard's Home",
//   characteristics: ["location"],
//   text: "**KNOWLEDGE IS POWER** Each player plays with the top card of their deck face up.",
//   type: "location",
//   abilities: [
//     // {
//     //   name: "**KNOWLEDGE IS POWER**",
//     //   text: "Each player plays with the top card of their deck face up.",
//     //   TODO: This is implemented directly in the UI
//     // },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 1,
//   willpower: 7,
//   illustrator: "Gabe",
//   number: 170,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559715,
//   },
//   rarity: "uncommon",
//   moveCost: 1,
// };
//
