import type { CharacterCard } from "@tcg/lorcana-types";
import { bodyguard } from "../../ability-helpers";

export const simbaProtectiveCub: CharacterCard = {
  id: "rvm",
  cardType: "character",
  name: "Simba",
  version: "Protective Cub",
  fullName: "Simba - Protective Cub",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "001",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 20,
  inkable: true,
  externalIds: {
    ravensburger: "6479a6ae550768c207018562ce6f687ec41e7c86",
  },
  abilities: [bodyguard("rvm-1")],
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const simbaProtectiveCub: LorcanitoCharacterCard = {
//   id: "z0z",
//   name: "Simba",
//   title: "Protective Cub",
//   characteristics: ["hero", "storyborn", "prince"],
//   text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
//   type: "character",
//   abilities: [bodyguardAbility],
//   flavour: "Courage comes in all sizes.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Filipe Laurentino",
//   number: 20,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 503356,
//   },
//   rarity: "common",
// };
//
