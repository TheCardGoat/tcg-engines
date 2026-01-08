import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyTremaineOverbearingMatriarch: CharacterCard = {
  id: "r0v",
  cardType: "character",
  name: "Lady Tremaine",
  version: "Overbearing Matriarch",
  fullName: "Lady Tremaine - Overbearing Matriarch",
  inkType: ["ruby"],
  franchise: "Cinderella",
  set: "002",
  text: "NOT FOR YOU When you play this character, each opponent with more lore than you loses 1 lore.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 111,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6165fc64a0e304e3d44cc5ec4ec2c07b6c24207c",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const ladyTremaineOverbearingMatriarch: LorcanitoCharacterCard = {
//   id: "yy6",
//
//   name: "Lady Tremaine",
//   title: "Overbearing Matriarch",
//   characteristics: ["storyborn", "villain"],
//   text: "**NOT FOR YOU** When you play this character, each opponent with more lore than you loses 1 lore.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Not for You",
//       text: "When you play this character, each opponent with more lore than you loses 1 lore.",
//       // TODO: Add condition have less lore
//       effects: [
//         {
//           type: "lore",
//           amount: 1,
//           modifier: "subtract",
//           target: {
//             type: "player",
//             value: "opponent",
//           },
//         },
//       ],
//     },
//   ],
//   flavour:
//     "Make no mistake: this time I will make certain the key remains safe!",
//   colors: ["ruby"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Samanta Erdini",
//   number: 111,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 522698,
//   },
//   rarity: "common",
// };
//
