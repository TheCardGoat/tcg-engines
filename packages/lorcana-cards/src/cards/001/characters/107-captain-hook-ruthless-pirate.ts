import type { CharacterCard } from "@tcg/lorcana-types";

export const captainHookRuthlessPirate: CharacterCard = {
  abilities: [
    {
      id: "1k7-1",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "SELF",
        duration: "this-turn",
      },
      id: "1k7-2",
      name: "YOU COWARD!",
      text: "YOU COWARD! While this character is exerted, opposing characters with Evasive gain Reckless.",
      type: "static",
    },
  ],
  cardNumber: 107,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Pirate", "Captain"],
  cost: 7,
  externalIds: {
    ravensburger: "cb7f49afcece80ca059a1b80ac84424a7d69eeaa",
  },
  franchise: "Peter Pan",
  fullName: "Captain Hook - Ruthless Pirate",
  id: "1k7",
  inkType: ["ruby"],
  inkable: false,
  lore: 2,
  name: "Captain Hook",
  set: "001",
  strength: 5,
  text: "Rush (This character can challenge the turn they're played.)\nYOU COWARD! While this character is exerted, opposing characters with Evasive gain Reckless. (They can't quest and must challenge if able.)",
  version: "Ruthless Pirate",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import {
//   RecklessAbility,
//   RushAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { whileConditionOnThisCharacterTargetsGain } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const captainHookRecklessPirate: LorcanitoCharacterCard = {
//   Id: "heh",
//   Name: "Captain Hook",
//   Title: "Ruthless Pirate",
//   Characteristics: ["storyborn", "villain", "pirate", "captain"],
//   Text: "**Rush** _(This character can challenge the turn they're played.)_\n\n**YOU COWARD!** While this character is exerted, opposing characters with **Evasive** gain **Reckless**. _(They can't quest and must challenge if able.)_",
//   Type: "character",
//   Abilities: [
//     RushAbility,
//     WhileConditionOnThisCharacterTargetsGain({
//       Name: "You Coward!",
//       Text: "While this character is exerted, opposing characters with **Evasive** gain **Reckless**. _(They can't quest and must challenge if able.)_",
//       Conditions: [{ type: "exerted" }],
//       Ability: recklessAbility,
//       Target: {
//         Type: "card",
//         Value: "all",
//         Filters: [
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "opponent" },
//           { filter: "zone", value: "play" },
//           {
//             Filter: "ability",
//             Value: "evasive",
//           },
//         ],
//       },
//     }),
//   ],
//   Flavour: "You wouldn't dare fight old Hook man-to-man!",
//   Colors: ["ruby"],
//   Cost: 7,
//   Strength: 5,
//   Willpower: 5,
//   Lore: 2,
//   Illustrator: "Cam Kendell",
//   Number: 107,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508624,
//   },
//   Rarity: "rare",
// };
//
