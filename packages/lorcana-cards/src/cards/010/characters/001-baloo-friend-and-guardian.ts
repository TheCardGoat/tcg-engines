import type { CharacterCard } from "@tcg/lorcana-types";

export const balooFriendAndGuardian: CharacterCard = {
  abilities: [
    {
      id: "qnc-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      id: "qnc-2",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
  ],
  cardNumber: 1,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 6,
  externalIds: {
    ravensburger: "600b15a6131a9729bcbb09477b1417d11e96769f",
  },
  franchise: "Jungle Book",
  fullName: "Baloo - Friend and Guardian",
  id: "qnc",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  name: "Baloo",
  set: "010",
  strength: 3,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Friend and Guardian",
  willpower: 8,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import {
//   BodyguardAbility,
//   SupportAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Export const balooFriendAndGuardian: LorcanitoCharacterCard = {
//   Id: "oox",
//   Name: "Baloo",
//   Title: "Friend and Guardian",
//   Characteristics: ["storyborn", "ally"],
//   Text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
//   Type: "character",
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 6,
//   Strength: 3,
//   Willpower: 8,
//   Illustrator: "Amanda Duarte / Julio Cesar",
//   Number: 1,
//   Set: "010",
//   ExternalIds: {
//     TcgPlayer: 659178,
//   },
//   Rarity: "rare",
//   Abilities: [bodyguardAbility, supportAbility],
//   Lore: 2,
// };
//
