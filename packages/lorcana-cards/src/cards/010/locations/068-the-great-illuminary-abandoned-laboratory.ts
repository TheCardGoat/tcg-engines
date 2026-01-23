import type { LocationCard } from "@tcg/lorcana-types";

export const theGreatIlluminaryAbandonedLaboratory: LocationCard = {
  id: "10r",
  cardType: "location",
  name: "The Great Illuminary",
  version: "Abandoned Laboratory",
  fullName: "The Great Illuminary - Abandoned Laboratory",
  inkType: ["amethyst"],
  franchise: "Lorcana",
  set: "010",
  text: 'STARTLING DISCOVERY Characters gain " {E} — Draw a card" while here.',
  cost: 2,
  moveCost: 1,
  lore: 0,
  cardNumber: 68,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "847fbba16445f6522b828a8d298b8ccec406a28d",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { gainAbilityWhileHere } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const startlingDiscoveryAbility = {
//   type: "activated" as const,
//   costs: [{ type: "exert" as const }],
//   optional: false,
//   name: "STARTLING DISCOVERY",
//   text: "{E} — Draw a card",
//   effects: [drawACard],
// };
//
// export const theGreatIlluminaryAbandonedLaboratory: LorcanitoLocationCard = {
//   id: "h29",
//   name: "The Great Illuminary",
//   title: "Abandoned Laboratory",
//   characteristics: ["location"],
//   text: 'STARTLING DISCOVERY Characters gain " {E} — Draw a card" while here.',
//   type: "location",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   willpower: 3,
//   illustrator: "Priya Kakati",
//   number: 68,
//   set: "010",
//   rarity: "uncommon",
//   moveCost: 1,
//   lore: 1,
//   abilities: [
//     gainAbilityWhileHere({
//       ability: startlingDiscoveryAbility,
//       name: "STARTLING DISCOVERY",
//       text: 'Characters gain " {E} — Draw a card" while here.',
//     }),
//   ],
// };
//
