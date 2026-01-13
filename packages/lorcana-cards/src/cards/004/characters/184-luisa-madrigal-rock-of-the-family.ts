import type { CharacterCard } from "@tcg/lorcana-types";

export const luisaMadrigalRockOfTheFamily: CharacterCard = {
  id: "10a",
  cardType: "character",
  name: "Luisa Madrigal",
  version: "Rock of the Family",
  fullName: "Luisa Madrigal - Rock of the Family",
  inkType: ["steel"],
  franchise: "Encanto",
  set: "004",
  text: "I'M THE STRONG ONE While you have another character in play, this character gets +2 {S}.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 184,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "82cce795ee075eb98b612b69862d2f8c19ca368b",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Madrigal"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whileYouHaveAnotherCharacterInPlayThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const luisaMadrigalRockOfTheFamily: LorcanitoCharacterCard = {
//   id: "yza",
//   name: "Luisa Madrigal",
//   title: "Rock of the Family",
//   characteristics: ["storyborn", "ally", "madrigal"],
//   text: "**I'M THE STRONG ONE** While you have another character in play, this character gets +2 {S}.",
//   type: "character",
//   abilities: [
//     whileYouHaveAnotherCharacterInPlayThisCharacterGets({
//       name: "I'm The Strong One",
//       text: "While you have another character in play, this character gets +2 {S}.",
//       attribute: "strength",
//       amount: 2,
//     }),
//   ],
//   flavour: "There's no way Ursula's creatures are getting to that donkey.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 2,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Samantha Erdini",
//   number: 184,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547174,
//   },
//   rarity: "common",
// };
//
