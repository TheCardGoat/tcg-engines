import type { CharacterCard } from "@tcg/lorcana-types";
import { rush } from "../../ability-helpers";

export const peterPanFearlessFighter: CharacterCard = {
  id: "czp",
  cardType: "character",
  name: "Peter Pan",
  version: "Fearless Fighter",
  fullName: "Peter Pan - Fearless Fighter",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "001",
  text: "Rush (This character can challenge the turn they're played.)",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 119,
  inkable: false,
  externalIds: {
    ravensburger: "2ed2d4d7295557a864451ec395c78721255c0c17",
  },
  abilities: [rush("czp-1")],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { rushAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const peterPanFearless: LorcanitoCharacterCard = {
//   id: "luv",
//
//   name: "Peter Pan",
//   title: "Fearless Fighter",
//   illustrator: "Anh Dang",
//   characteristics: ["hero", "storyborn"],
//   text: "**Rush** _(This character can challenge the turn they're played.)_",
//   type: "character",
//   abilities: [rushAbility],
//   flavour:
//     "Nobody calls Pan a coward and lives! I'll fight you man-to-man, with one hand behind my back.",
//   colors: ["ruby"],
//   cost: 3,
//   strength: 3,
//   willpower: 2,
//   lore: 1,
//   number: 119,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508787,
//   },
//   rarity: "common",
// };
//
