import type { CharacterCard } from "@tcg/lorcana-types";

export const pepaMadrigalWeatherMaker: CharacterCard = {
  id: "7gu",
  cardType: "character",
  name: "Pepa Madrigal",
  version: "Weather Maker",
  fullName: "Pepa Madrigal - Weather Maker",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "004",
  text: "IT LOOKS LIKE RAIN When you play this character, you may exert chosen opposing character. That character can't ready at the start of their next turn unless they're at a location.",
  cost: 5,
  strength: 1,
  willpower: 5,
  lore: 1,
  cardNumber: 53,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1aea1a364780b0736c993d3055013dd602442cf8",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Madrigal"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { exertAndCantReadyAtTheeStartOfTheirTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const pepaMadrigalWeatherMaker: LorcanitoCharacterCard = {
//   id: "zc5",
//   missingTestCase: true,
//   name: "Pepa Madrigal",
//   title: "Weather Maker",
//   characteristics: ["storyborn", "ally", "madrigal"],
//   text: "**IT LOOKS LIKE RAIN** When you play this character, you may exert chosen opposing character. That character can't ready at the start of their next turn unless you're at a location.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "It Looks Like Rain",
//       text: "When you play this character, you may exert chosen opposing character. That character can't ready at the start of their next turn unless you're at a location.",
//       optional: true,
//       effects: exertAndCantReadyAtTheeStartOfTheirTurn(chosenOpposingCharacter),
//     },
//   ],
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 1,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Samantha Erdini",
//   number: 53,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 548205,
//   },
//   rarity: "rare",
// };
//
