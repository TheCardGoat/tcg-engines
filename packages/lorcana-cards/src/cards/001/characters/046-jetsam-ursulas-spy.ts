import type { CharacterCard } from "@tcg/lorcana-types";

export const jetsamUrsulasSpy: CharacterCard = {
  abilities: [
    {
      id: "cdv-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        duration: "this-turn",
        keyword: "Evasive",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
      },
      id: "cdv-2",
      name: "SINISTER SLITHER",
      text: "SINISTER SLITHER Your characters named Flotsam gain Evasive.",
      type: "static",
    },
  ],
  cardNumber: 46,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "2ca35abecd4db3d354a35de835504ac0657f0a85",
  },
  franchise: "Little Mermaid",
  fullName: "Jetsam - Ursula’s Spy",
  id: "cdv",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  name: "Jetsam",
  set: "001",
  strength: 3,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSINISTER SLITHER Your characters named Flotsam gain Evasive.",
  version: "Ursula’s Spy",
  willpower: 3,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const jetsamUrsulaSpy: LorcanitoCharacterCard = {
//   Id: "lh1",
//   Name: "Jetsam",
//   Title: "Ursula's Spy",
//   Characteristics: ["storyborn", "ally"],
//   Text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n**SINISTER SLITHER** Your characters named Flotsam gain **Evasive.**",
//   Type: "character",
//   Abilities: [
//     EvasiveAbility,
//     {
//       Type: "static",
//       Ability: "gain-ability",
//       Name: "Sinister Slither",
//       Text: "Your characters named Flotsam gain **Evasive.**",
//       GainedAbility: evasiveAbility,
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
//             Comparison: { operator: "eq", value: "Flotsam" },
//           },
//         ],
//       },
//     },
//   ],
//   Flavour: "We can help you get anything you want. . . .",
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 3,
//   Lore: 1,
//   Illustrator: "Brian Weisz",
//   Number: 46,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 503317,
//   },
//   Rarity: "common",
// };
//
