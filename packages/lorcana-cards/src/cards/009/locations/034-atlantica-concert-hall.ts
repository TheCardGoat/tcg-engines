import type { LocationCard } from "@tcg/lorcana-types";

export const atlanticaConcertHall: LocationCard = {
  id: "r9e",
  cardType: "location",
  name: "Atlantica",
  version: "Concert Hall",
  fullName: "Atlantica - Concert Hall",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "009",
  text: "UNDERWATER ACOUSTICS Characters count as having +2 cost to sing songs while here.",
  cost: 1,
  moveCost: 2,
  lore: 0,
  cardNumber: 34,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6240734d322d9cb3fe3a5da76f4b06701345127c",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { atlanticaConcertHall as ogAtlanticaConcertHall } from "@lorcanito/lorcana-engine/cards/004/locations/33-atlantica-concert-hall";
//
// export const atlanticaConcertHall: LorcanitoLocationCard = {
//   ...ogAtlanticaConcertHall,
//   id: "wzf",
//   reprints: [ogAtlanticaConcertHall.id],
//   number: 34,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649981,
//   },
// };
//
