import type { CharacterCard } from "@tcg/lorcana-types";

export const rogerRadcliffeDogLover: CharacterCard = {
  id: "1t4",
  cardType: "character",
  name: "Roger Radcliffe",
  version: "Dog Lover",
  fullName: "Roger Radcliffe - Dog Lover",
  inkType: ["amber"],
  franchise: "101 Dalmatians",
  set: "007",
  text: "THERE YOU GO Whenever this character quests, you may remove up to 1 damage from each of your Puppy characters.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 5,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "eac2ac31d2370e8bb57973ee953fec1616cdcb05",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenCharacterCharacteristic } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const rogerRadcliffeDogLover: LorcanitoCharacterCard = {
//   id: "c3f",
//   name: "Roger Radcliffe",
//   title: "Dog Lover",
//   characteristics: ["storyborn", "ally"],
//   text: "THERE YOU GO Whenever this character quests, you may remove up to 1 damage from each of your Puppy characters.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "THERE YOU GO",
//       text: "Whenever this character quests, you may remove up to 1 damage from each of your Puppy characters.",
//       effects: [
//         {
//           type: "heal",
//           amount: 1,
//           upTo: true,
//           target: chosenCharacterCharacteristic(["puppy"]),
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   strength: 1,
//   willpower: 2,
//   illustrator: "Hedvig H-S",
//   number: 5,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619408,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
