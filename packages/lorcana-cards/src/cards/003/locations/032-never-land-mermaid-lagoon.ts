import type { LocationCard } from "@tcg/lorcana-types";

export const neverLandMermaidLagoon: LocationCard = {
  id: "h5t",
  cardType: "location",
  name: "Never Land",
  version: "Mermaid Lagoon",
  fullName: "Never Land - Mermaid Lagoon",
  inkType: ["amber"],
  franchise: "Peter Pan",
  set: "003",
  cost: 1,
  moveCost: 1,
  lore: 0,
  cardNumber: 32,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "3dda47c95f7fd5557d048647909c7fb4c9f62dbb",
  },
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
//
// export const neverLandMermaidLagoon: LorcanitoLocationCard = {
//   id: "waj",
//   type: "location",
//   name: "Never Land",
//   title: "Mermaid Lagoon",
//   characteristics: ["location"],
//   flavour:
//     "The mermaids told Peter they'd seen some items floating by several days earlier, but they were more concerned that one of their sisters had gone missing.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   moveCost: 1,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Cecile Carre",
//   number: 32,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 534089,
//   },
//   rarity: "common",
// };
//
