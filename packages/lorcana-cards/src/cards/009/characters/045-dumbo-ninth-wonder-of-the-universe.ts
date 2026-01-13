import type { CharacterCard } from "@tcg/lorcana-types";

export const dumboNinthWonderOfTheUniverse: CharacterCard = {
  id: "181",
  cardType: "character",
  name: "Dumbo",
  version: "Ninth Wonder of the Universe",
  fullName: "Dumbo - Ninth Wonder of the Universe",
  inkType: ["amethyst"],
  franchise: "Dumbo",
  set: "009",
  text: 'Evasive (Only characters with Evasive can challenge this character.)\nBREAKING RECORDS {E}, 1 {I} – Draw a card and gain 1 lore.\nMAKING HISTORY Your other characters with Evasive gain "{E}, 1 {I} – Draw a card and gain 1 lore."',
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 45,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9f83ac8f13bb044cb3d019364b03009d2cde5683",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   evasiveAbility,
//   yourOtherCharactersWithGain,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import {
//   drawACard,
//   youGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const dumboNinthWonderOfTheUniverse: LorcanitoCharacterCard = {
//   id: "uxf",
//   name: "Dumbo",
//   title: "Ninth Wonder of the Universe",
//   characteristics: ["storyborn", "hero"],
//   text: 'Evasive\nBREAKING RECORDS {E}, 1 {I} – Draw a card and gain 1 lore.\nMAKING HISTORY Your other characters with Evasive gain "{E}, 1 {I} – Draw a card and gain 1 lore."',
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Mariana Moreno",
//   number: 45,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 647680,
//   },
//   rarity: "legendary",
//   abilities: [
//     evasiveAbility,
//     {
//       type: "activated",
//       name: "BREAKING RECORDS",
//       text: "{E}, 1 {I} – If you have 2 or more characters in play, gain 1 lore.",
//       costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
//       effects: [youGainLore(1), drawACard],
//     },
//     yourOtherCharactersWithGain({
//       name: "MAKING HISTORY",
//       text: 'Your other characters with Evasive gain "{E}, 1 {I} – Draw a card and gain 1 lore."',
//       filter: { filter: "ability", value: "evasive" },
//       gainedAbility: {
//         name: "MAKING HISTORY",
//         type: "activated",
//         text: "{E}, 1 {I} – If you have 2 or more characters in play, gain 1 lore.",
//         costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
//         effects: [youGainLore(1), drawACard],
//       },
//     }),
//   ],
//   lore: 1,
// };
//
