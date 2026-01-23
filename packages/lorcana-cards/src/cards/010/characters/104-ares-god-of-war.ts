import type { CharacterCard } from "@tcg/lorcana-types";

export const aresGodOfWar: CharacterCard = {
  id: "3s2",
  cardType: "character",
  name: "Ares",
  version: "God of War",
  fullName: "Ares - God of War",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "010",
  text: "Reckless (This character can't quest and must challenge each turn if able.) CALL TO BATTLE Once during your turn, whenever you put a card under one of your characters or locations, you may ready chosen character. If you do, that character can't quest for the rest of this turn.",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 0,
  cardNumber: 104,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0d9f37f549c31a2ff2bb7bb968f6d2adc8591fac",
  },
  abilities: [],
  classifications: ["Storyborn", "Deity"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { recklessAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverYouPutACardUnder } from "@lorcanito/lorcana-engine/abilities/boostAbility";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const aresGodOfWar: LorcanitoCharacterCard = {
//   id: "l58",
//   name: "Ares",
//   title: "God of War",
//   characteristics: ["storyborn", "deity"],
//   text: "Reckless\n\nCALL TO BATTLE Once during your turn, whenever you put a card under one of your characters or locations, you may ready chosen character. If you do, that character can't quest for the rest of this turn.",
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Kiersten Hale",
//   number: 104,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660339,
//   },
//   rarity: "uncommon",
//   lore: 0,
//   abilities: [
//     recklessAbility,
//     wheneverYouPutACardUnder({
//       name: "CALL TO BATTLE",
//       text: "Once during your turn, whenever you put a card under one of your characters or locations, you may ready chosen character. If you do, that character can't quest for the rest of this turn.",
//       oncePerTurn: true,
//       optional: true,
//       target: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "owner", value: "self" },
//           { filter: "type", value: ["character", "location"] },
//           { filter: "zone", value: "play" },
//         ],
//       },
//       effects: readyAndCantQuest(chosenCharacter),
//     }),
//   ],
// };
//
