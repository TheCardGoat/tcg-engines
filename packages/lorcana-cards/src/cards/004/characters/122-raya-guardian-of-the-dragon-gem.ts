import type { CharacterCard } from "@tcg/lorcana-types";

export const rayaGuardianOfTheDragonGem: CharacterCard = {
  id: "1n3",
  cardType: "character",
  name: "Raya",
  version: "Guardian of the Dragon Gem",
  fullName: "Raya - Guardian of the Dragon Gem",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  text: "WE HAVE TO COME TOGETHER When you play this character, ready chosen character of yours at a location. They can't quest for the rest of this turn.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 122,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d4c8f5da2de21bcd1a503c94b73329c9baaf09eb",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacterOfYoursAtLocation } from "@lorcanito/lorcana-engine/abilities/targets";
// import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const rayaGuardianOfTheDragonGem: LorcanitoCharacterCard = {
//   id: "cbs",
//   missingTestCase: true,
//   name: "Raya",
//   title: "Guardian of the Dragon Gem",
//   characteristics: ["hero", "storyborn", "princess"],
//   text: "**WE MUST JOIN FORCES** When you play this character, ready chosen character of yours at a location. They can't quest for the rest of this turn.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "We Must Join Forces",
//       text: "When you play this character, ready chosen character of yours at a location. They can't quest for the rest of this turn.",
//       effects: readyAndCantQuest(chosenCharacterOfYoursAtLocation),
//     },
//   ],
//   flavour: "There are too many for me. But not for us.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Britteny Hackett",
//   number: 122,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550599,
//   },
//   rarity: "common",
// };
//
