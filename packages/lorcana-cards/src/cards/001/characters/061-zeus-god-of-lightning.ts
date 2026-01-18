import type { CharacterCard } from "@tcg/lorcana-types";
import { challenger, rush } from "../../ability-helpers";

export const zeusGodOfLightning: CharacterCard = {
  id: "1o1",
  cardType: "character",
  name: "Zeus",
  version: "God of Lightning",
  fullName: "Zeus - God of Lightning",
  inkType: ["amethyst"],
  franchise: "Hercules",
  set: "001",
  text: "Rush (This character can challenge the turn they're played.)\nChallenger +4 (While challenging, this character gets +4 {S}.)",
  cost: 4,
  strength: 0,
  willpower: 4,
  lore: 2,
  cardNumber: 61,
  inkable: false,
  externalIds: {
    ravensburger: "dadb267eccd432e2568673dafcf9b187459bc477",
  },
  abilities: [rush("1o1-1"), challenger("1o1-2", 4)],
  classifications: ["Storyborn", "Deity"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   challengerAbility,
//   rushAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const zeusGodOfLightning: LorcanitoCharacterCard = {
//   id: "wvl",
//   name: "Zeus",
//   title: "God of Lightning",
//   characteristics: ["storyborn", "deity"],
//   text: "**Rush** _(This character can challenge the turn they're played.)_\n**Challenger** +4 (_When challenging, this character get +4 {S}._)",
//   type: "character",
//   strength: 0,
//   abilities: [challengerAbility(4), rushAbility],
//   flavour: "A little lightning solves a whole lot of problems.",
//   colors: ["amethyst"],
//   cost: 4,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Koni",
//   number: 61,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 502540,
//   },
//   rarity: "rare",
// };
//
