import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellPeterPansAlly: CharacterCard = {
  abilities: [
    {
      id: "oug-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 1,
        target: "YOUR_CHARACTERS",
        duration: "this-turn",
      },
      id: "oug-2",
      name: "LOYAL AND DEVOTED",
      text: "LOYAL AND DEVOTED Your characters named Peter Pan gain Challenger +1.",
      type: "static",
    },
  ],
  cardNumber: 58,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Fairy"],
  cost: 5,
  externalIds: {
    ravensburger: "598be1e1fde814f7659cf509dad4db7131a68730",
  },
  franchise: "Peter Pan",
  fullName: "Tinker Bell - Peter Pan’s Ally",
  id: "oug",
  inkType: ["amethyst"],
  inkable: false,
  lore: 2,
  name: "Tinker Bell",
  set: "001",
  strength: 3,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nLOYAL AND DEVOTED Your characters named Peter Pan gain Challenger +1. (They get +1 {S} while challenging.)",
  version: "Peter Pan’s Ally",
  willpower: 3,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import {
//   ChallengerAbility,
//   EvasiveAbility,
//   Type GainAbilityStaticAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const tinkerBellPeterPan: LorcanitoCharacterCard = {
//   Id: "xbz",
//
//   Name: "Tinker Bell",
//   Title: "Peter Pan's Ally",
//   Characteristics: ["storyborn", "ally", "fairy"],
//   Text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**LOYAL AND DEVOTED** Your characters named Peter Pan gain **Challenger +1.** _(They get +1 {S} while challenging.)_",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "static",
//       Name: "Loyal and Devoted",
//       Text: "Your characters named Peter Pan gain **Challenger +1.** _(They get +1 {S} while challenging.)_",
//       Ability: "gain-ability",
//       GainedAbility: challengerAbility(1),
//       Target: {
//         Type: "card",
//         Value: "all",
//         Filters: [
//           { filter: "zone", value: "play" },
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "self" },
//           {
//             Filter: "attribute",
//             Value: "name",
//             Comparison: { operator: "eq", value: "Peter Pan" },
//           },
//         ],
//       },
//     } as GainAbilityStaticAbility,
//     EvasiveAbility,
//   ],
//   Colors: ["amethyst"],
//   Cost: 5,
//   Strength: 3,
//   Willpower: 3,
//   Lore: 2,
//   Illustrator: "Adrianne Gumaya",
//   Number: 58,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 507488,
//   },
//   Rarity: "common",
// };
//
