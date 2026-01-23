import type { CharacterCard } from "@tcg/lorcana-types";

export const svenReindeerSteed: CharacterCard = {
  id: "m3t",
  cardType: "character",
  name: "Sven",
  version: "Reindeer Steed",
  fullName: "Sven - Reindeer Steed",
  inkType: ["amber"],
  franchise: "Frozen",
  set: "005",
  text: "REINDEER GAMES When you play this character, you may ready chosen character. They can't quest or challenge for the rest of this turn.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 23,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4fac01ae24ed46541c989cd4724efec55c02a694",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { readyAndCantQuestOrChallenge } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const svenReindeerSteed: LorcanitoCharacterCard = {
//   id: "xe9",
//   name: "Sven",
//   title: "Reindeer Steed",
//   characteristics: ["storyborn", "ally"],
//   text: "**REINDEER GAMES** When you play this character, you may ready chosen character. They can’t quest or challenge for the rest of this turn.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Reindeer Games",
//       text: "When you play this character, you may ready chosen character. They can’t quest or challenge for the rest of this turn.",
//       optional: true,
//       effects: readyAndCantQuestOrChallenge(chosenCharacter),
//     },
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Gonzalo Kenny",
//   number: 23,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559714,
//   },
//   rarity: "uncommon",
// };
//
