import type { CharacterCard } from "@tcg/lorcana-types";

export const tukTukDisarminglyCute: CharacterCard = {
  abilities: [
    {
      id: "1xz-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      id: "1xz-2",
      keyword: "Resist",
      text: "Resist +2",
      type: "keyword",
      value: 2,
    },
  ],
  cardNumber: 187,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "fc3303c43ff9b9600d46c652cda744f6e999e753",
  },
  franchise: "Raya and the Last Dragon",
  fullName: "Tuk Tuk - Disarmingly Cute",
  id: "1xz",
  inkType: ["steel"],
  inkable: false,
  lore: 1,
  name: "Tuk Tuk",
  set: "007",
  strength: 0,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nResist +2 (Damage dealt to this character is reduced by 2.)",
  version: "Disarmingly Cute",
  willpower: 1,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import {
//   BodyguardAbility,
//   ResistAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const tukTukDisarminglyCute: LorcanitoCharacterCard = {
//   Id: "v8s",
//   Name: "Tuk Tuk",
//   Title: "Disarmingly Cute",
//   Characteristics: ["storyborn", "ally"],
//   Text: "Bodyguard\nResist +2",
//   Type: "character",
//   Abilities: [bodyguardAbility, resistAbility(2)],
//   Inkwell: false,
//   Colors: ["steel"],
//   Cost: 2,
//   Strength: 0,
//   Willpower: 1,
//   Illustrator: "Maria Dresden",
//   Number: 187,
//   Set: "007",
//   ExternalIds: {
//     TcgPlayer: 619514,
//   },
//   Rarity: "rare",
//   Lore: 1,
// };
//
