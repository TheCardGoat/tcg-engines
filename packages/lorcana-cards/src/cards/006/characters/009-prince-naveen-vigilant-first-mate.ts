import type { CharacterCard } from "@tcg/lorcana-types";

export const princeNaveenVigilantFirstMate: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "1hg-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      id: "1hg-2",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
  ],
  cardNumber: 9,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Prince"],
  cost: 5,
  externalIds: {
    ravensburger: "c0abf4ad2073b023e3021c1547836aab812568ff",
  },
  franchise: "Princess and the Frog",
  fullName: "Prince Naveen - Vigilant First Mate",
  id: "1hg",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  name: "Prince Naveen",
  set: "006",
  strength: 2,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Prince Naveen.)\nBodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  version: "Vigilant First Mate",
  willpower: 6,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import {
//   BodyguardAbility,
//   ShiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Export const princeNaveenVigilantFirstMate: LorcanitoCharacterCard = {
//   Id: "o4d",
//   Name: "Prince Naveen",
//   Title: "Vigilant First Mate",
//   Characteristics: ["floodborn", "hero", "prince"],
//   Text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Prince Naveen.)\nBodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
//   Type: "character",
//   Abilities: [shiftAbility(3, "Prince Naveen"), bodyguardAbility],
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 5,
//   Strength: 2,
//   Willpower: 6,
//   Lore: 2,
//   Illustrator: "Francesco Colucci",
//   Number: 9,
//   Set: "006",
//   ExternalIds: {
//     TcgPlayer: 592016,
//   },
//   Rarity: "uncommon",
// };
//
