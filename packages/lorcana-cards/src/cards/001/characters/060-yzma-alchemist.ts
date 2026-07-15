import type { CharacterCard } from "@tcg/lorcana-types";

export const yzmaAlchemist: CharacterCard = {
  abilities: [],
  cardNumber: 60,
  cardType: "character",
  classifications: ["Dreamborn", "Sorcerer", "Villain"],
  cost: 2,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Yzma - Alchemist",
  id: "drx",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  name: "Yzma",
  set: "001",
  strength: 2,
  text: "**YOU",
  version: "Alchemist",
  willpower: 2,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { lookAtTopCardOfYourDeckAndPutItOnTopOrBottom } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const yzmaAlchemist: LorcanitoCharacterCard = {
//   Id: "drx",
//   Name: "Yzma",
//   Title: "Alchemist",
//   Characteristics: ["dreamborn", "sorcerer", "villain"],
//   Text: "**YOU'RE EXCUSED** Whenever this character quests, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
//   Type: "character",
//   Abilities: [
//     WheneverQuests({
//       Effects: [lookAtTopCardOfYourDeckAndPutItOnTopOrBottom],
//     }),
//   ],
//   Flavour: '"When I want your opinion, I will give it to you!"',
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 2,
//   Strength: 2,
//   Willpower: 2,
//   Lore: 1,
//   Illustrator: "Hadjie Joos",
//   Number: 60,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492715,
//   },
//   Rarity: "common",
// };
//
