import type { CharacterCard } from "@tcg/lorcana-types";

export const chiefBogoGazelleFan: CharacterCard = {
  id: "172",
  cardType: "character",
  name: "Chief Bogo",
  version: "Gazelle Fan",
  fullName: "Chief Bogo - Gazelle Fan",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "006",
  text: "YOU LIKE GAZELLE TOO? While you have a character named Gazelle in play, this character gains Singer 6. (He counts as cost 6 to sing songs.)",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  cardNumber: 11,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9df5299f05ee9034bd55228067385a123cb15a75",
  },
  abilities: [],
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { singerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whileYouHaveACharacterNamedThisCharGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const chiefBogoGazelleFan: LorcanitoCharacterCard = {
//   id: "xym",
//   missingTestCase: true,
//   name: "Chief Bogo",
//   title: "Gazelle Fan",
//   characteristics: ["storyborn"],
//   text: "YOU LIKE GAZELLE TOO? While you have a character named Gazelle in play, this character gains Singer 6. (He counts as cost 6 to sing songs.)",
//   type: "character",
//   abilities: [
//     whileYouHaveACharacterNamedThisCharGains({
//       name: "You Like Gazelle Too",
//       text: "While you have a character named Gazelle in play, this character gains Singer 6.",
//       ability: singerAbility(6),
//       characterName: "Gazelle",
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 4,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Cristian Romero",
//   number: 11,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593000,
//   },
//   rarity: "common",
// };
//
