import type { CharacterCard } from "@tcg/lorcana-types";

export const herculesTrueHero: CharacterCard = {
  abilities: [
    {
      id: "1ch-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
  ],
  cardNumber: 191,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Prince"],
  cost: 3,
  externalIds: {
    ravensburger: "aec8753f7f97cb51feeedf58b45f27661b18c44e",
  },
  franchise: "Hercules",
  fullName: "Hercules - True Hero",
  id: "1ch",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  name: "Hercules",
  set: "009",
  strength: 3,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  version: "True Hero",
  willpower: 3,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { herculesTrueHero as ogHerculesTrueHero } from "@lorcanito/lorcana-engine/cards/001/characters/181-hercules-true-hero";
//
// Export const herculesTrueHero: LorcanitoCharacterCard = {
//   ...ogHerculesTrueHero,
//   Id: "s5k",
//   Reprints: [ogHerculesTrueHero.id],
//   Number: 191,
//   Set: "009",
//   ExternalIds: {
//     TcgPlayer: 650124,
//   },
// };
//
