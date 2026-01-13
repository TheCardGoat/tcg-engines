import type { CharacterCard } from "@tcg/lorcana-types";

export const scuttleExpertOnHumans: CharacterCard = {
  id: "dpt",
  cardType: "character",
  name: "Scuttle",
  version: "Expert on Humans",
  fullName: "Scuttle - Expert on Humans",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "004",
  text: "LET ME SEE When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 154,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "31704def1d802226e01db38740244b78a7210207",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   LorcanitoCharacterCard,
//   ScryEffect,
// } from "@lorcanito/lorcana-engine";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const scuttleExpertOnHumans: LorcanitoCharacterCard = {
//   id: "r46",
//   name: "Scuttle",
//   title: "Expert on Humans",
//   characteristics: ["storyborn", "ally"],
//   text: "**LET ME SEE** When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it in your hand. Put the rest on the bottom of your deck in any order.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "LET ME SEE",
//       text: "When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it in your hand. Put the rest on the bottom of your deck in any order.",
//       effects: [
//         {
//           type: "scry",
//           amount: 4,
//           mode: "bottom",
//           shouldRevealTutored: true,
//           target: self,
//           limits: {
//             bottom: 4,
//             top: 0,
//             inkwell: 0,
//             hand: 1,
//           },
//           tutorFilters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "deck" },
//             { filter: "type", value: "item" },
//           ],
//         } as ScryEffect,
//       ],
//     },
//   ],
//   flavour: "Wow. This is special. This is very, very unusual.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Kapik",
//   number: 154,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549431,
//   },
//   rarity: "uncommon",
// };
//
