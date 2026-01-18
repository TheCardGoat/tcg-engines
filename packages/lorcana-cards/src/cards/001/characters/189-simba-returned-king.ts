import type { CharacterCard } from "@tcg/lorcana-types";
import { challenger } from "../../ability-helpers";

export const simbaReturnedKing: CharacterCard = {
  id: "nj8",
  cardType: "character",
  name: "Simba",
  version: "Returned King",
  fullName: "Simba - Returned King",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "001",
  text: "Challenger +4 (While challenging, this character gets +4 {S}.)\nPOUNCE During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  cost: 7,
  strength: 4,
  willpower: 6,
  lore: 2,
  cardNumber: 189,
  inkable: true,
  externalIds: {
    ravensburger: "54d1da804f89e6da94d1e9a335acf6a5baa79ff5",
  },
  abilities: [
    challenger("nj8-1", 4),
    {
      id: "nj8-2",
      text: "POUNCE During your turn, this character gains Evasive.",
      name: "POUNCE",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
        duration: "this-turn",
      },
    },
  ],
  classifications: ["Storyborn", "Hero", "King"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   challengerAbility,
//   duringYourTurnGains,
//   evasiveAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const simbaReturnedKing: LorcanitoCharacterCard = {
//   id: "hgu",
//   name: "Simba",
//   title: "Returned King",
//   characteristics: ["hero", "storyborn", "king"],
//   text: "**Challenger** +4 (While challenging, this character gets\r+4 {S}.)\n**POUNCE** During your turn, this character gains \r**Evasive**. _(They can challenge characters with Evasive.)_",
//   type: "character",
//   abilities: [
//     challengerAbility(4),
//     duringYourTurnGains(
//       "Pounce",
//       "During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_",
//       evasiveAbility,
//     ),
//   ],
//   flavour: "„I‘ll do whatever it takes to save my kingdom.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 7,
//   strength: 4,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Nicholas Kole",
//   number: 189,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492741,
//   },
//   rarity: "rare",
// };
//
