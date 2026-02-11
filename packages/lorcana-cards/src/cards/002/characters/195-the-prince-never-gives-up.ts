import type { CharacterCard } from "@tcg/lorcana-types";

export const thePrinceNeverGivesUp: CharacterCard = {
  abilities: [
    {
      id: "14d-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      id: "14d-2",
      keyword: "Resist",
      text: "Resist +1",
      type: "keyword",
      value: 1,
    },
  ],
  cardNumber: 195,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Prince"],
  cost: 3,
  externalIds: {
    ravensburger: "9351aa8ca706988419d548e97f2d1c534856a8d0",
  },
  franchise: "Snow White",
  fullName: "The Prince - Never Gives Up",
  id: "14d",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  name: "The Prince",
  set: "002",
  strength: 1,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nResist +1 (Damage dealt to this character is reduced by 1.)",
  version: "Never Gives Up",
  willpower: 3,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import {
//   BodyguardAbility,
//   ResistAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const thePrinceNeverGivesUp: LorcanitoCharacterCard = {
//   Id: "g5k",
//
//   Name: "The Prince",
//   Title: "Never Gives Up",
//   Characteristics: ["hero", "dreamborn", "prince"],
//   Text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_\n\n**Resist** +1 _(Damage dealt to this character is reduced by 1.)_",
//   Type: "character",
//   Abilities: [bodyguardAbility, resistAbility(1)],
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 3,
//   Strength: 1,
//   Willpower: 3,
//   Lore: 2,
//   Illustrator: "Eri Welli",
//   Number: 195,
//   Set: "ROF",
//   ExternalIds: {
//     TcgPlayer: 517607,
//   },
//   Rarity: "uncommon",
// };
//
