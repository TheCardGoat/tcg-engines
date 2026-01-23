import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaIceMaker: CharacterCard = {
  id: "1v2",
  cardType: "character",
  name: "Elsa",
  version: "Ice Maker",
  fullName: "Elsa - Ice Maker",
  inkType: ["amethyst", "sapphire"],
  franchise: "Frozen",
  set: "007",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Elsa.)\nWINTER WALL Whenever this character quests, you may exert chosen character. If you do and you have a character named Anna in play, the chosen character can’t ready at the start of their next turn.",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 69,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f288eb233a11571c7c54690d782dcb3cf69e5c05",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Queen", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import {
//   ifYouHaveCharacterNamed,
//   notHaveCharacterNamed,
// } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import {
//   exertAndCantReadyAtTheeStartOfTheirTurn,
//   exertChosenCharacter,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const elsaIceMaker: LorcanitoCharacterCard = {
//   id: "ejk",
//   name: "Elsa",
//   title: "Ice Maker",
//   characteristics: ["floodborn", "hero", "queen", "sorcerer"],
//   text: "Shift 4\nWINTER WALL Whenever this character quests, you may exert chosen character. If you do and you have a character named Anna in play, the chosen character can't ready at the start of their next turn.",
//   type: "character",
//   abilities: [
//     shiftAbility(4, "Elsa"),
//     wheneverQuests({
//       name: "WINTER WALL",
//       text: "Whenever this character quests, you may exert chosen character. If you do and you have a character named Anna in play, the chosen character can't ready at the start of their next turn.",
//       optional: true,
//       conditions: [ifYouHaveCharacterNamed("Anna")],
//       effects: exertAndCantReadyAtTheeStartOfTheirTurn({
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//         ],
//       }),
//     }),
//     wheneverQuests({
//       name: "WINTER WALL",
//       text: "Whenever this character quests, you may exert chosen character. If you do and you have a character named Anna in play, the chosen character can't ready at the start of their next turn.",
//       optional: true,
//       conditions: [notHaveCharacterNamed("Anna")],
//       effects: [exertChosenCharacter],
//     }),
//   ],
//   inkwell: false,
//   colors: ["amethyst", "sapphire"],
//   cost: 7,
//   strength: 5,
//   willpower: 5,
//   illustrator: "Ian MacDonald",
//   number: 69,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618356,
//   },
//   rarity: "super_rare",
//   lore: 2,
// };
//
