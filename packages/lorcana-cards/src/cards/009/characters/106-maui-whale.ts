import type { CharacterCard } from "@tcg/lorcana-types";

export const mauiWhale: CharacterCard = {
  id: "4dw",
  cardType: "character",
  name: "Maui",
  version: "Whale",
  fullName: "Maui - Whale",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "009",
  text: "THIS MISSION IS CURSED This character can't ready at the start of your turn.\nI GOT YOUR BACK 2 {I} – Ready this character. He can't quest for the rest of this turn.",
  cost: 7,
  strength: 8,
  willpower: 8,
  lore: 1,
  cardNumber: 106,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0fcf0e2feea7eeb8a66963a14505ba849931709b",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Deity"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { mauiWhale as ogMauiWhale } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
//
// export const mauiWhale: LorcanitoCharacterCard = {
//   ...ogMauiWhale,
//   id: "daf",
//   reprints: [ogMauiWhale.id],
//   number: 106,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650044,
//   },
// };
//
