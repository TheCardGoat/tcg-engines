import type { CharacterCard } from "@tcg/lorcana-types";

export const scarViciousCheater: CharacterCard = {
  id: "1re",
  cardType: "character",
  name: "Scar",
  version: "Vicious Cheater",
  fullName: "Scar - Vicious Cheater",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "002",
  text: "Rush (This character can challenge the turn they're played.)\nDADDY ISN'T HERE TO SAVE YOU During your turn, whenever this character banishes another character in a challenge, you may ready this character. He can't quest for the rest of this turn.",
  cost: 7,
  strength: 6,
  willpower: 5,
  lore: 2,
  cardNumber: 125,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e36200725d9e116115b62410d83a714d9c837c7a",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { rushAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverBanishesAnotherCharacterInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const scarViciousCheater: LorcanitoCharacterCard = {
//   id: "i4t",
//   name: "Scar",
//   title: "Vicious Cheater",
//   characteristics: ["storyborn", "villain"],
//   text: "**Rush** _(This character can challenge the turn they're played.)_\n\n**DADDY ISN'T HERE TO SAVE YOU** During your turn, whenever this character banishes another character in a challenge, you may ready this character. He can't quest for the rest of this turn.",
//   type: "character",
//   abilities: [
//     rushAbility,
//     wheneverBanishesAnotherCharacterInChallenge({
//       name: "Daddy Isn't Here to Save You",
//       text: "During your turn, whenever this character banishes another character in a challenge, you may ready this character. He can't quest for the rest of this turn.",
//       effects: [
//         ...readyAndCantQuest({
//           type: "card",
//           value: "all",
//           filters: [{ filter: "source", value: "self" }],
//         }),
//       ],
//     }),
//   ],
//   colors: ["ruby"],
//   cost: 7,
//   strength: 6,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Nicholas Kole",
//   number: 125,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 523760,
//   },
//   rarity: "legendary",
// };
//
