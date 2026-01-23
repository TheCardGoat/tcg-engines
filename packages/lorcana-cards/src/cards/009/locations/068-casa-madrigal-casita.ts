import type { LocationCard } from "@tcg/lorcana-types";

export const casaMadrigalCasita: LocationCard = {
  id: "115",
  cardType: "location",
  name: "Casa Madrigal",
  version: "Casita",
  fullName: "Casa Madrigal - Casita",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "009",
  text: "OUR HOME At the start of your turn, if you have a character here, gain 1 lore.",
  cost: 1,
  moveCost: 1,
  lore: 0,
  cardNumber: 68,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "86c8f197eff8c61973ac292a62a4be6cd966c168",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { casaMadrigalCasita as ogCasaMadrigalCasita } from "@lorcanito/lorcana-engine/cards/004/locations/67-casa-madrigal-casita";
//
// export const casaMadrigalCasita: LorcanitoLocationCard = {
//   ...ogCasaMadrigalCasita,
//   id: "jx4",
//   reprints: [ogCasaMadrigalCasita.id],
//   number: 68,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650010,
//   },
// };
//
