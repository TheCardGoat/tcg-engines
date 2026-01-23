import type { CharacterCard } from "@tcg/lorcana-types";

export const jetsamUrsulasSpy: CharacterCard = {
  id: "cdv",
  cardType: "character",
  name: "Jetsam",
  version: "Ursula’s Spy",
  fullName: "Jetsam - Ursula’s Spy",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "001",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSINISTER SLITHER Your characters named Flotsam gain Evasive.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 46,
  inkable: true,
  externalIds: {
    ravensburger: "2ca35abecd4db3d354a35de835504ac0657f0a85",
  },
  abilities: [
    {
      id: "cdv-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
    {
      id: "cdv-2",
      text: "SINISTER SLITHER Your characters named Flotsam gain Evasive.",
      name: "SINISTER SLITHER",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "YOUR_CHARACTERS",
        duration: "this-turn",
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const jetsamUrsulaSpy: LorcanitoCharacterCard = {
//   id: "lh1",
//   name: "Jetsam",
//   title: "Ursula's Spy",
//   characteristics: ["storyborn", "ally"],
//   text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n**SINISTER SLITHER** Your characters named Flotsam gain **Evasive.**",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "Sinister Slither",
//       text: "Your characters named Flotsam gain **Evasive.**",
//       gainedAbility: evasiveAbility,
//       target: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "zone", value: "play" },
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "self" },
//           {
//             filter: "attribute",
//             value: "name",
//             comparison: { operator: "eq", value: "Flotsam" },
//           },
//         ],
//       },
//     },
//   ],
//   flavour: "We can help you get anything you want. . . .",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Brian Weisz",
//   number: 46,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 503317,
//   },
//   rarity: "common",
// };
//
