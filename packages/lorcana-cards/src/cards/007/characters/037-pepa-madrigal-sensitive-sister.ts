import type { CharacterCard } from "@tcg/lorcana-types";

export const pepaMadrigalSensitiveSister: CharacterCard = {
  id: "1km",
  cardType: "character",
  name: "Pepa Madrigal",
  version: "Sensitive Sister",
  fullName: "Pepa Madrigal - Sensitive Sister",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "007",
  text: "CLEAR SKIES, CLEAR SKIES Whenever one or more of your characters sings a song, gain 1 lore.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 37,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cc1aa602cb2089e854c848bf55d994adcbf44b15",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Madrigal"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverOneOrMoreOfYourCharSingsASong } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const pepaMadrigalSensitiveSister: LorcanitoCharacterCard = {
//   id: "yb6",
//   name: "Pepa Madrigal",
//   title: "Sensitive Sister",
//   characteristics: ["storyborn", "ally", "madrigal"],
//   text: "CLEAR SKIES, CLEAR SKIES Whenever one or more of your characters sings a song, gain 1 lore.",
//   type: "character",
//   abilities: [
//     wheneverOneOrMoreOfYourCharSingsASong({
//       name: "CLEAR SKIES, CLEAR SKIES",
//       text: "Whenever one or more of your characters sings a song, gain 1 lore.",
//       effects: [youGainLore(1)],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   strength: 2,
//   willpower: 4,
//   illustrator: "Valentina Grassiuso",
//   number: 37,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619428,
//   },
//   rarity: "super_rare",
//   lore: 1,
// };
//
