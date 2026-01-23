import type { CharacterCard } from "@tcg/lorcana-types";

export const peterPanShadowFinder: CharacterCard = {
  id: "g3g",
  cardType: "character",
  name: "Peter Pan",
  version: "Shadow Finder",
  fullName: "Peter Pan - Shadow Finder",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "004",
  text: "Rush (This character can challenge the turn they're played.)\nEvasive (Only characters with Evasive can challenge this character.)\nFLY, OF COURSE! Your other characters with Evasive gain Rush.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 54,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3a02b32b7275fe9cb597814a840f682abcc7a7ae",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   evasiveAbility,
//   rushAbility,
//   yourOtherCharactersWithGain,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const peterPanShadowFinder: LorcanitoCharacterCard = {
//   id: "o7c",
//   name: "Peter Pan",
//   title: "Shadow Finder",
//   characteristics: ["hero", "storyborn"],
//   text: "**Rush** _(This character can challenge the turn they're played.)_\n\n\n**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n\n**FLY, OF COURSE!** Your other characters with **Evasive** gain **Rush.**",
//   type: "character",
//   abilities: [
//     rushAbility,
//     evasiveAbility,
//     yourOtherCharactersWithGain({
//       name: "Fly, Of Course!",
//       text: "Your other characters with **Evasive** gain **Rush.**",
//       gainedAbility: rushAbility,
//       filter: { filter: "ability", value: "evasive" },
//     }),
//   ],
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Emily Abeydeera",
//   number: 54,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549458,
//   },
//   rarity: "super_rare",
// };
//
