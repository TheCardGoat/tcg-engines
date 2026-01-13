import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinCrab: CharacterCard = {
  id: "1ih",
  cardType: "character",
  name: "Merlin",
  version: "Crab",
  fullName: "Merlin - Crab",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "READY OR NOT! When you play this character and when he leaves play, chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 50,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c432eb95dc74c15e1c3ca51d73030c05e9924344",
  },
  abilities: [],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { whenPlayAndWhenLeaves } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const merlinCrab: LorcanitoCharacterCard = {
//   id: "gxt",
//   name: "Merlin",
//   title: "Crab",
//   characteristics: ["sorcerer", "storyborn", "mentor"],
//   text: "**READY OR NOT!** When you play this character and when he leaves play, chosen character gains **Challenger** +3 this turn. _(They get +3 {S} while challenging.)_",
//   type: "character",
//   abilities: whenPlayAndWhenLeaves({
//     name: "READY OR NOT!",
//     text: "When you play this character and when he leaves play, chosen character gains **Challenger** +3 this turn. _(They get +3 {S} while challenging.)_",
//     effects: [
//       {
//         type: "ability",
//         ability: "challenger",
//         amount: 3,
//         modifier: "add",
//         duration: "turn",
//         target: chosenCharacter,
//       },
//     ],
//   }),
//   flavour: "He'll be out of this in a snap!",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   number: 50,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 522652,
//   },
//   rarity: "common",
//   illustrator: "Valentina Graziuso",
// };
//
