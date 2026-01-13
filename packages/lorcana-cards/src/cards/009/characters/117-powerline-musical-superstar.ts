import type { CharacterCard } from "@tcg/lorcana-types";

export const powerlineMusicalSuperstar: CharacterCard = {
  id: "yez",
  cardType: "character",
  name: "Powerline",
  version: "Musical Superstar",
  fullName: "Powerline - Musical Superstar",
  inkType: ["ruby"],
  franchise: "Goofy Movie",
  set: "009",
  text: "ELECTRIC MOVE If you've played a song this turn, this character gains Rush this turn. (They can challenge the turn they're played.)",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 117,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7c09ff334bb918873fd9fc6d51c903bd4edfce46",
  },
  abilities: [],
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { rushAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whileConditionThisCharacterGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const powerlineMusicalSuperstar: LorcanitoCharacterCard = {
//   id: "e1k",
//   name: "Powerline",
//   title: "Musical Superstar",
//   characteristics: ["storyborn"],
//   text: "ELECTRIC MOVE If you've played a song this turn, this character gains Rush this turn.",
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 4,
//   willpower: 3,
//   illustrator: "Kenneth Andersson",
//   number: 117,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650053,
//   },
//   rarity: "rare",
//   lore: 1,
//   abilities: [
//     whileConditionThisCharacterGains({
//       name: "ELECTRIC MOVE",
//       text: "If you've played a song this turn, this character gains Rush this turn.",
//       conditions: [{ type: "played-songs" }],
//       ability: rushAbility,
//     }),
//   ],
// };
//
