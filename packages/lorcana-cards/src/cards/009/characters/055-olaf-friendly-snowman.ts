import type { CharacterCard } from "@tcg/lorcana-types";

export const olafFriendlySnowman: CharacterCard = {
  id: "7rf",
  cardType: "character",
  name: "Olaf",
  version: "Friendly Snowman",
  fullName: "Olaf - Friendly Snowman",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "009",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 55,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "1bf94a823f68742ae9675a5e30529f8865d22fac",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { olafFriendlySnowman as olafFriendlySnowmanAsOrig } from "@lorcanito/lorcana-engine/cards/001/characters/052-olaf-friendly-snowman";
//
// export const olafFriendlySnowman: LorcanitoCharacterCard = {
//   ...olafFriendlySnowmanAsOrig,
//   id: "q9w",
//   reprints: [olafFriendlySnowmanAsOrig.id],
//   number: 55,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649999,
//   },
// };
//
