import type { CharacterCard } from "@tcg/lorcana-types";

export const maxGoofRockinTeen: CharacterCard = {
  id: "i0b",
  cardType: "character",
  name: "Max Goof",
  version: "Rockin' Teen",
  fullName: "Max Goof - Rockin' Teen",
  inkType: ["ruby"],
  franchise: "Goofy Movie",
  set: "009",
  text: "Singer 5 (This character counts as cost 5 to sing songs.)\nI JUST WANNA STAY HOME This character can't move to locations.",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 112,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "40e788a23d54bbcc499d63975ecd2b9885ecc59f",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   type EffectStaticAbility,
//   singerAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// const justWannaStayAtHome: EffectStaticAbility = {
//   name: "I JUST WANNA STAY HOME",
//   text: "This character can't move to locations.",
//   type: "static",
//   ability: "effects",
//   target: thisCharacter, // Without this the ability can't target itself... The engine is so confusing
//   effects: [
//     {
//       type: "restriction",
//       restriction: "move-to-location",
//       target: thisCharacter,
//     },
//   ],
// };
//
// export const maxGoofRockinTeen: LorcanitoCharacterCard = {
//   id: "ob7",
//   name: "Max Goof",
//   title: "Rockin' Teen",
//   characteristics: ["storyborn", "hero"],
//   text: "Singer 5 (This character counts as cost 5 to sing songs.)\nI JUST WANNA STAY HOME This character can't move to locations.",
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 4,
//   willpower: 3,
//   illustrator: "Stefano Spagnuolo",
//   number: 112,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650048,
//   },
//   rarity: "common",
//   abilities: [singerAbility(5), justWannaStayAtHome],
//   lore: 1,
// };
//
