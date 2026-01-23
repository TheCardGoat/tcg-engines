import type { CharacterCard } from "@tcg/lorcana-types";

export const auroraWakingBeauty: CharacterCard = {
  id: "cy2",
  cardType: "character",
  name: "Aurora",
  version: "Waking Beauty",
  fullName: "Aurora - Waking Beauty",
  inkType: ["amber"],
  franchise: "Sleeping Beauty",
  set: "007",
  text: "Singer 5 (This character counts as cost 5 to sing songs.)\nSWEET DREAMS Whenever you remove 1 or more damage from a character, ready this character. She can't quest or challenge for the rest of this turn.",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 14,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2ea925b3bcd4e58c5bd1d5bb775db0d24bf1d993",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { singerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverYouHealAnyCharacter } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { readyAndCantQuestOrChallenge } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const auroraWakingBeauty: LorcanitoCharacterCard = {
//   id: "rgd",
//   name: "Aurora",
//   title: "Waking Beauty",
//   characteristics: ["storyborn", "hero", "princess"],
//   text: "Singer 5\nSWEET DREAMS Whenever you remove 1 or more damage from a character, ready this character. She can't quest or challenge for the rest of this turn.",
//   type: "character",
//   abilities: [
//     singerAbility(5),
//     wheneverYouHealAnyCharacter({
//       name: "SWEET DREAMS",
//       text: "Whenever you remove 1 or more damage from a character, ready this character. She can't quest or challenge for the rest of this turn.",
//       effects: readyAndCantQuestOrChallenge(thisCharacter),
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   strength: 1,
//   willpower: 4,
//   illustrator: "Lisanne Konterman",
//   number: 14,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619414,
//   },
//   rarity: "legendary",
//   lore: 2,
// };
//
