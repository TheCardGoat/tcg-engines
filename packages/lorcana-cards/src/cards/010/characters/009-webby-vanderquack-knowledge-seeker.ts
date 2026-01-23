import type { CharacterCard } from "@tcg/lorcana-types";

export const webbyVanderquackKnowledgeSeeker: CharacterCard = {
  id: "15d",
  cardType: "character",
  name: "Webby Vanderquack",
  version: "Knowledge Seeker",
  fullName: "Webby Vanderquack - Knowledge Seeker",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "010",
  text: "I'VE READ ABOUT THIS While you have a character or location in play with a card under them, this character gets +1 {L}.",
  cost: 3,
  strength: 1,
  willpower: 6,
  lore: 1,
  cardNumber: 9,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "95238358d3a1be4da06bd9f8c1940dc4276806a6",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
//
// export const haveACharOrLocationWithACardUnder: Condition = {
//   type: "filter",
//   comparison: { operator: "gte", value: 1 },
//   filters: [
//     { filter: "owner", value: "self" },
//     {
//       filter: "type",
//       value: ["character", "location"],
//     },
//     {
//       filter: "zone",
//       value: "play",
//     },
//     {
//       filter: "has_card_under_them",
//       comparison: { operator: "gte", value: 1 },
//     },
//   ],
// };
//
// export const webbyVanderquackKnowledgeSeeker: LorcanitoCharacterCard = {
//   id: "fgh",
//   name: "Webby Vanderquack",
//   title: "Knowledge Seeker",
//   characteristics: ["storyborn", "ally"],
//   text: "I'VE READ ABOUT THIS While you have a character or location in play with a card under them, this character gets +1 {L}.",
//   type: "character",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   strength: 1,
//   willpower: 6,
//   illustrator: "Lauren Levering / Patri Balanovsky",
//   number: 9,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659445,
//   },
//   rarity: "uncommon",
//   lore: 1,
//   abilities: [
//     whileConditionThisCharacterGets({
//       name: "I'VE READ ABOUT THIS",
//       text: "While you have a character or location in play with a card under them, this character gets +1 {L}.",
//       conditions: [haveACharOrLocationWithACardUnder],
//       attribute: "lore",
//       amount: 1,
//     }),
//   ],
// };
//
