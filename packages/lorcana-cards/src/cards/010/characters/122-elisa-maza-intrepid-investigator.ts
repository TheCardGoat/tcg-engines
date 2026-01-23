import type { CharacterCard } from "@tcg/lorcana-types";

export const elisaMazaIntrepidInvestigator: CharacterCard = {
  id: "65o",
  cardType: "character",
  name: "Elisa Maza",
  version: "Intrepid Investigator",
  fullName: "Elisa Maza - Intrepid Investigator",
  inkType: ["ruby"],
  franchise: "Gargoyles",
  set: "010",
  text: "SPECIAL DETAIL While you have 2 or more other characters in play with 5 {S} or more, this character gets +2 {L}.",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 122,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "163121c1a9d00c67b04086d8523139c8e4f29e66",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
//
// export const haveTwoOtherCharactersWithStrength5OrMore: Condition = {
//   type: "filter",
//   comparison: { operator: "gte", value: 2 },
//   excludeSelf: true,
//   filters: [
//     { filter: "owner", value: "self" },
//     { filter: "type", value: "character" },
//     { filter: "zone", value: "play" },
//     {
//       filter: "attribute",
//       value: "strength",
//       comparison: { operator: "gte", value: 5 },
//     },
//   ],
// };
//
// export const elisaMazaIntrepidInvestigator: LorcanitoCharacterCard = {
//   id: "t81",
//   name: "Elisa Maza",
//   title: "Intrepid Investigator",
//   characteristics: ["storyborn", "hero", "detective"],
//   text: "SPECIAL DETAIL While you have 2 or more other characters in play with 5 {S} or more, this character gets +2 {L}.",
//   type: "character",
//   inkwell: false,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 4,
//   willpower: 3,
//   illustrator: "Paloma Sauvage",
//   number: 122,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658293,
//   },
//   rarity: "rare",
//   lore: 1,
//   abilities: [
//     whileConditionThisCharacterGets({
//       name: "SPECIAL DETAIL",
//       text: "While you have 2 or more other characters in play with 5 {S} or more, this character gets +2 {L}.",
//       conditions: [haveTwoOtherCharactersWithStrength5OrMore],
//       attribute: "lore",
//       amount: 2,
//     }),
//   ],
// };
//
