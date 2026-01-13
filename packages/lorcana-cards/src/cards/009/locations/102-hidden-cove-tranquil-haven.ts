import type { LocationCard } from "@tcg/lorcana-types";

export const hiddenCoveTranquilHaven: LocationCard = {
  id: "1ts",
  cardType: "location",
  name: "Hidden Cove",
  version: "Tranquil Haven",
  fullName: "Hidden Cove - Tranquil Haven",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "009",
  text: "REVITALIZING WATERS Characters get +1 {S} and +1 {W} while here.",
  cost: 1,
  moveCost: 1,
  lore: 0,
  cardNumber: 102,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ed1ae5d7eae7e91e80de930096d8be65b9f13e21",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { hiddenCoveTranquilHaven as ogHiddenCoveTranquilHaven } from "@lorcanito/lorcana-engine/cards/004/locations/101-hidden-cove-tranquil-haven";
//
// export const hiddenCoveTranquilHaven: LorcanitoLocationCard = {
//   ...ogHiddenCoveTranquilHaven,
//   id: "sxr",
//   reprints: [ogHiddenCoveTranquilHaven.id],
//   number: 102,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650040,
//   },
// };
//
