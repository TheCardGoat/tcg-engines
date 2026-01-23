import type { CharacterCard } from "@tcg/lorcana-types";

export const beastRelentless: CharacterCard = {
  id: "8rn",
  cardType: "character",
  name: "Beast",
  version: "Relentless",
  fullName: "Beast - Relentless",
  inkType: ["emerald"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "SECOND WIND Whenever an opposing character is damaged, you may ready this character.",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 70,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1f998b8d166c57c497364060cda6ba1cc7a4a1bf",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverOppCharIsDamaged } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { readyThisCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const beastRelentless: LorcanitoCharacterCard = {
//   id: "ky8",
//   name: "Beast",
//   title: "Relentless",
//   characteristics: ["hero", "storyborn", "prince"],
//   text: "**SECOND WIND** Whenever an opposing character is damaged, you may ready this character.",
//   type: "character",
//   abilities: [
//     wheneverOppCharIsDamaged({
//       name: "Second Wind",
//       text: "Whenever an opposing character is damaged, you may ready this character.",
//       optional: true,
//       effects: [readyThisCharacter],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 6,
//   strength: 4,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Eri Welli",
//   number: 70,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 520858,
//   },
//   rarity: "legendary",
// };
//
