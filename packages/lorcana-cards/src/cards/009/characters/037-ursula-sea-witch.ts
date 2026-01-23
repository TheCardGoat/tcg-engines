import type { CharacterCard } from "@tcg/lorcana-types";

export const ursulaSeaWitch: CharacterCard = {
  id: "j6j",
  cardType: "character",
  name: "Ursula",
  version: "Sea Witch",
  fullName: "Ursula - Sea Witch",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "009",
  text: "YOU'RE TOO LATE Whenever this character quests, chosen opposing character can’t ready at the start of their next turn.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 37,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4521d899a2717c3b4cb0b936f066e13e266d14cb",
  },
  abilities: [],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { ursulaSeaWitch as ogUrsulaSeaWitch } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
//
// export const ursulaSeaWitch: LorcanitoCharacterCard = {
//   ...ogUrsulaSeaWitch,
//   id: "i2h",
//   reprints: [ogUrsulaSeaWitch.id],
//   number: 37,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649984,
//   },
// };
//
