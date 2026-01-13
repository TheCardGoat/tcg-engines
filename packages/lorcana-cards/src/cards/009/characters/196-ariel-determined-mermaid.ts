import type { CharacterCard } from "@tcg/lorcana-types";

export const arielDeterminedMermaid: CharacterCard = {
  id: "gsz",
  cardType: "character",
  name: "Ariel",
  version: "Determined Mermaid",
  fullName: "Ariel - Determined Mermaid",
  inkType: ["steel"],
  franchise: "Little Mermaid",
  set: "009",
  text: "I WANT MORE Whenever you play a song, you may draw a card, then choose and discard a card.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 196,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3c90f7d78a7f6faad9aeb5edd3c7f5da84a98a4a",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { arielDeterminedMermaid as ogArielDeterminedMermaid } from "@lorcanito/lorcana-engine/cards/004/characters/174-ariel-determined-mermaid";
//
// export const arielDeterminedMermaid: LorcanitoCharacterCard = {
//   ...ogArielDeterminedMermaid,
//   id: "b8l",
//   reprints: [ogArielDeterminedMermaid.id],
//   number: 196,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650129,
//   },
// };
//
