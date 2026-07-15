import type { CharacterCard } from "@tcg/lorcana-types";

export const herculesTrueHero: CharacterCard = {
  abilities: [
    {
      effect: {
        restriction: "enters-play-exerted",
        target: "SELF",
        type: "restriction",
      },
      id: "uyj-1",
      text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
      type: "static",
    },
  ],
  cardNumber: 181,
  cardType: "character",
  classifications: ["Hero", "Dreamborn", "Prince"],
  cost: 3,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Hercules - True Hero",
  id: "uyj",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  name: "Hercules",
  set: "001",
  strength: 3,
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
  version: "True Hero",
  willpower: 3,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const herculesTrueHero: LorcanitoCharacterCard = {
//   Id: "uyj",
//   Reprints: ["s5k"],
//
//   Name: "Hercules",
//   Title: "True Hero",
//   Characteristics: ["hero", "dreamborn", "prince"],
//   Text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
//   Type: "character",
//   Abilities: [bodyguardAbility],
//   Flavour: "„You gotta admit, that was pretty heroic.",
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 3,
//   Strength: 3,
//   Willpower: 3,
//   Lore: 1,
//   Illustrator: "Marcel Berg",
//   Number: 181,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492716,
//   },
//   Rarity: "common",
// };
//
