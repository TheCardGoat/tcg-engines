import type { CharacterCard } from "@tcg/lorcana-types";

export const camiloMadrigalPrankster: CharacterCard = {
  id: "1vj",
  cardType: "character",
  name: "Camilo Madrigal",
  version: "Prankster",
  fullName: "Camilo Madrigal - Prankster",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "009",
  text: "MANY FORMS At the start of your turn, you may choose one:\n- This character gets +1 {L} this turn.\n- This character gains Challenger +2 this turn.\n(While challenging, this character gets +2 {S}.)",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  cardNumber: 52,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "06c33d8303cbe3698922ef017c553b693cb45e56",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Madrigal"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { camiloMadrigalPrankster as ogCamiloMadrigalPrankster } from "@lorcanito/lorcana-engine/cards/004/characters/040-camilo-madrigal-prankster";
//
// export const camiloMadrigalPrankster: LorcanitoCharacterCard = {
//   ...ogCamiloMadrigalPrankster,
//   id: "bij",
//   reprints: [ogCamiloMadrigalPrankster.id],
//   number: 52,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649996,
//   },
// };
//
