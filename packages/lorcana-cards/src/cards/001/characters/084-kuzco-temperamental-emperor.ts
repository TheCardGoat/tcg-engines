import type { CharacterCard } from "@tcg/lorcana-types";

export const kuzcoTemperamentalEmperor: CharacterCard = {
  abilities: [],
  cardNumber: 84,
  cardType: "character",
  classifications: ["Storyborn", "King"],
  cost: 5,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Kuzco - Temperamental Emperor",
  id: "j7u",
  inkType: ["emerald"],
  inkable: true,
  lore: 3,
  name: "Kuzco",
  set: "001",
  strength: 2,
  text: "**Ward** _(Opponents can",
  version: "Temperamental Emperor",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { whenChallengedAndBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { banishChallengingCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const kuzcoTemperamentalEmperor: LorcanitoCharacterCard = {
//   Id: "j7u",
//   Reprints: ["l2r"],
//   Name: "Kuzco",
//   Title: "Temperamental Emperor",
//   Characteristics: ["storyborn", "king"],
//   Text: "**Ward** _(Opponents can't choose this character except to challenge.)_\n\n**NO TOUCHY!** When this character is challenged and banished, you may banish the challenging character.",
//   Type: "character",
//   Abilities: [
//     WhenChallengedAndBanished({
//       Name: "No Touchy!",
//       Text: "When this character is challenged and banished, you may banish the challenging character.",
//       Optional: true,
//       Effects: [banishChallengingCharacter],
//     }),
//     WardAbility,
//   ],
//   Flavour:
//     "I asked for emerald and that is clearly jade! What is wrong with you people?",
//   Colors: ["emerald"],
//   Cost: 5,
//   Strength: 2,
//   Willpower: 4,
//   Lore: 3,
//   Illustrator: "Grace Tran",
//   Number: 84,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 507284,
//   },
//   Rarity: "rare",
// };
//
