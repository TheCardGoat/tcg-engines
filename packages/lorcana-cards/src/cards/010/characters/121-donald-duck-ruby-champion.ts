import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckRubyChampion: CharacterCard = {
  id: "10w",
  cardType: "character",
  name: "Donald Duck",
  version: "Ruby Champion",
  fullName: "Donald Duck - Ruby Champion",
  inkType: ["ruby"],
  set: "010",
  text: "HIGH ENERGY Your other Ruby characters get +1 {S}.\nPOWERFUL REWARD Your other Ruby characters with 7 {S} or more get +1 {L}.",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  cardNumber: 121,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "850bd5ec2e325a93ef18b43b0a1491375105b5f1",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import type { StaticAbilityWithEffect } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// const highEnergy: StaticAbilityWithEffect = {
//   type: "static",
//   name: "HIGH ENERGY",
//   text: "Your other Ruby characters get +1 {S}.",
//   ability: "effects",
//   effects: [
//     {
//       type: "attribute",
//       attribute: "strength",
//       amount: 1,
//       modifier: "add",
//       duration: "static",
//       target: {
//         type: "card",
//         value: "all",
//         excludeSelf: true,
//         filters: [
//           { filter: "zone", value: "play" },
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "self" },
//           { filter: "color", value: "ruby" },
//         ],
//       },
//     },
//   ],
// };
//
// const powerfulReward: StaticAbilityWithEffect = {
//   type: "static",
//   name: "POWERFUL REWARD",
//   text: "Your other Ruby characters with 7 {S} or more get +1 lore.",
//   ability: "effects",
//   effects: [
//     {
//       type: "attribute",
//       attribute: "lore",
//       amount: 1,
//       modifier: "add",
//       duration: "static",
//       target: {
//         type: "card",
//         value: "all",
//         excludeSelf: true,
//         filters: [
//           { filter: "zone", value: "play" },
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "self" },
//           { filter: "color", value: "ruby" },
//           {
//             filter: "attribute",
//             value: "strength",
//             comparison: { operator: "gte", value: 7 },
//           },
//         ],
//       },
//     },
//   ],
// };
//
// export const donaldDuckRubyChampion: LorcanitoCharacterCard = {
//   id: "ns3",
//   name: "Donald Duck",
//   title: "Ruby Champion",
//   characteristics: ["dreamborn", "hero"],
//   text: "HIGH ENERGY Your other Ruby characters get +1 {S}. POWERFUL REWARD Your other Ruby characters with 7 {S} or more get +1 lore.",
//   type: "character",
//   inkwell: false,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 4,
//   willpower: 4,
//   illustrator: "Lisa Parfenova",
//   number: 121,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659629,
//   },
//   rarity: "rare",
//   lore: 1,
//   abilities: [highEnergy, powerfulReward],
// };
//
