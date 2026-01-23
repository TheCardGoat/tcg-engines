import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseAmberChampion: CharacterCard = {
  id: "12o",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Amber Champion",
  fullName: "Mickey Mouse - Amber Champion",
  inkType: ["amber"],
  set: "010",
  text: "LEADING THE WAY Your other Amber characters get +2 {W}.\nFRIENDLY CHORUS While you have 2 or more other Amber characters in play, this character gains Singer 8. (They count as cost 8 to sing songs.)",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  cardNumber: 23,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8b5bb1ddb1139b3e466d0eef356d18aa520cb49c",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { singerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
//
// const whileYouHaveTwoOrMoreOtherAmberCharacters: Condition = {
//   type: "filter",
//   comparison: { operator: "gte", value: 3 }, // Including himself
//   filters: [
//     { filter: "owner", value: "self" },
//     { filter: "type", value: "character" },
//     { filter: "zone", value: "play" },
//     { filter: "color", value: "amber" },
//   ],
// };
//
// export const mickeyMouseAmberChampion: LorcanitoCharacterCard = {
//   id: "uyh",
//   name: "Mickey Mouse",
//   title: "Amber Champion",
//   characteristics: ["dreamborn", "hero"],
//   type: "character",
//   text: "LEADING THE WAY Your other Amber characters get +2.{W} FRIENDLY CHORUS While you have 2 or more other Amber characters in play, this character gains Singer 8.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 2,
//   willpower: 5,
//   illustrator: "Lisa Parfenova",
//   number: 23,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659628,
//   },
//   rarity: "rare",
//   lore: 1,
//   abilities: [
//     {
//       type: "static",
//       ability: "effects",
//       name: "LEADING THE WAY",
//       text: "Your other Amber characters get +2 {W}.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "willpower",
//           amount: 2,
//           modifier: "add",
//           target: {
//             type: "card",
//             value: "all",
//             excludeSelf: true,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "color", value: "amber" },
//             ],
//           },
//         },
//       ],
//     },
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "FRIENDLY CHORUS",
//       text: "While you have 2 or more other Amber characters in play, this character gains Singer 8.",
//       target: thisCharacter,
//       gainedAbility: singerAbility(8),
//       conditions: [whileYouHaveTwoOrMoreOtherAmberCharacters],
//     },
//   ],
// };
//
