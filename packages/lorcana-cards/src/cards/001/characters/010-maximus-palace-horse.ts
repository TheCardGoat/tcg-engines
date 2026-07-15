import type { CharacterCard } from "@tcg/lorcana-types";

export const maximusPalaceHorse: CharacterCard = {
  abilities: [
    {
      id: "174-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      id: "174-2",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
  ],
  cardNumber: 10,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "9c79c4e5854191f1b12a381fa7541ea2ea9b38da",
  },
  franchise: "Tangled",
  fullName: "Maximus - Palace Horse",
  id: "174",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  name: "Maximus",
  set: "001",
  strength: 4,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Palace Horse",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import {
//   BodyguardAbility,
//   SupportAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const maximusPalaceHorse: LorcanitoCharacterCard = {
//   Id: "pfk",
//   Name: "Maximus",
//   Title: "Palace Horse",
//   Characteristics: ["storyborn", "ally"],
//   Text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_\n\n**Support** _(Whenever this character quests, you may add their {S} to another chosen character‘s {S} this turn.)",
//   Type: "character",
//   Abilities: [supportAbility, bodyguardAbility],
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 5,
//   Strength: 4,
//   Willpower: 5,
//   Lore: 1,
//   Illustrator: "Brian Weisz",
//   Number: 10,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 506837,
//   },
//   Rarity: "super_rare",
// };
//
