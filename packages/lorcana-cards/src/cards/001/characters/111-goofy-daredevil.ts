import type { CharacterCard } from "@tcg/lorcana-types";
import { evasive } from "../../ability-helpers";

export const goofyDaredevil: CharacterCard = {
  id: "cgx",
  cardType: "character",
  name: "Goofy",
  version: "Daredevil",
  fullName: "Goofy - Daredevil",
  inkType: ["ruby"],
  set: "001",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 111,
  inkable: true,
  externalIds: {
    ravensburger: "2cf1d9fb4a6212482783f1497e8c8a756df859b0",
  },
  abilities: [evasive("cgx-1")],
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const goofyDaredevil: LorcanitoCharacterCard = {
//   id: "h4l",
//   name: "Goofy",
//   title: "Daredevil",
//   characteristics: ["hero", "dreamborn"],
//   illustrator: "Kenneth Anderson",
//   text: "**Evasive** (_Only characters with Evasive can challenge this character._)",
//   type: "character",
//   abilities: [evasiveAbility],
//   flavour: "Sometimes you gotta give it the ol’ jump and hyuck.",
//   inkwell: true,
//   rarity: "common",
//   colors: ["ruby"],
//   cost: 5,
//   strength: 3,
//   willpower: 4,
//   lore: 2,
//   number: 111,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 490389,
//   },
// };
//
