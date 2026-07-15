import type { CharacterCard } from "@tcg/lorcana-types";

export const herculesBelovedHero: CharacterCard = {
  abilities: [
    {
      id: "1wx-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      id: "1wx-2",
      keyword: "Resist",
      text: "Resist +1",
      type: "keyword",
      value: 1,
    },
  ],
  cardNumber: 186,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince"],
  cost: 6,
  externalIds: {
    ravensburger: "f866b4683c87eff51a272c4dd392843627dd0da3",
  },
  franchise: "Hercules",
  fullName: "Hercules - Beloved Hero",
  id: "1wx",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  name: "Hercules",
  set: "009",
  strength: 6,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nResist +1 (Damage dealt to this character is reduced by 1.)",
  version: "Beloved Hero",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { herculesBelovedHero as herculesBelovedHeroAsOrig } from "@lorcanito/lorcana-engine/cards/004/characters/180-hercules-beloved-hero";
//
// Export const herculesBelovedHero: LorcanitoCharacterCard = {
//   ...herculesBelovedHeroAsOrig,
//   Id: "p5o",
//   Reprints: [herculesBelovedHeroAsOrig.id],
//   Number: 186,
//   Set: "009",
//   ExternalIds: {
//     TcgPlayer: 650119,
//   },
// };
//
