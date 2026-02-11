import type { CharacterCard } from "@tcg/lorcana-types";

export const heiheiProtectiveRooster: CharacterCard = {
  abilities: [
    {
      id: "9lo-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
  ],
  cardNumber: 179,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "229b50a7f3386e0bd2aa989a726fa7a22826eee1",
  },
  franchise: "Moana",
  fullName: "HeiHei - Protective Rooster",
  id: "9lo",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  name: "HeiHei",
  set: "005",
  strength: 4,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  version: "Protective Rooster",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Export const heiheiProtectiveRooster: LorcanitoCharacterCard = {
//   Id: "l2b",
//   Name: "HeiHei",
//   Title: "Protective Rooster",
//   Characteristics: ["dreamborn", "ally"],
//   Text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your character must chose one with Bodyguard if able.)_",
//   Type: "character",
//   Abilities: [bodyguardAbility],
//   Flavour: 'Who’s the "boat snack" now?!',
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 5,
//   Strength: 4,
//   Willpower: 5,
//   Lore: 2,
//   Illustrator: "Brian Weisz",
//   Number: 179,
//   Set: "SSK",
//   ExternalIds: {
//     TcgPlayer: 561158,
//   },
//   Rarity: "common",
// };
//
