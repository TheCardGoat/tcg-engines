import type { CharacterCard } from "@tcg/lorcana-types";

export const svenOfficialIceDeliverer: CharacterCard = {
  id: "1rq",
  cardType: "character",
  name: "Sven",
  version: "Official Ice Deliverer",
  fullName: "Sven - Official Ice Deliverer",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "009",
  cost: 6,
  strength: 5,
  willpower: 7,
  lore: 1,
  cardNumber: 56,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "e5a8c4b90dc84d19a4aaae97b279a35a00cd5b09",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { svenOficialIceDeliverer as svenOfficialIceDelivererAsOrig } from "@lorcanito/lorcana-engine/cards/001/characters/055-sven-official-ice-deliverer";
//
// export const svenOfficialIceDeliverer: LorcanitoCharacterCard = {
//   ...svenOfficialIceDelivererAsOrig,
//   id: "tf5",
//   reprints: [svenOfficialIceDelivererAsOrig.id],
//   number: 56,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650000,
//   },
// };
//
