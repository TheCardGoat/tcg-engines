import type { CharacterCard } from "@tcg/lorcana-types";

export const turboRoyalHack: CharacterCard = {
  id: "1fa",
  cardType: "character",
  name: "Turbo",
  version: "Royal Hack",
  fullName: "Turbo - Royal Hack",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "005",
  text: "Rush (This character can challenge the turn they're played.)\nGAME JUMP This character also counts as being named King Candy for Shift.",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 106,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b8da8904ffbfda9ff8696e65ffc6d53e7848dbad",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Racer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { rushAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const turboRoyalHack: LorcanitoCharacterCard = {
//   id: "k3a",
//   name: "Turbo",
//   title: "Royal Hack",
//   characteristics: ["storyborn", "villain", "racer"],
//   text: "**Rush** _(This character can challenge the turn they’re played.)_ **GAME JUMP** This character also counts as being named King Candy for **Shift**.",
//   type: "character",
//   abilities: [
//     rushAbility,
//     // {
//     //   implemented directly on canShift
//     //   name: "**GAME JUMP** This character also counts as being named King Candy for **Shift**.",
//     // },
//   ],
//   colors: ["ruby"],
//   cost: 2,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Juan Diego Leon",
//   number: 106,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 555260,
//   },
//   rarity: "uncommon",
// };
//
