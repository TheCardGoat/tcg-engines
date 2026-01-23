import type { CharacterCard } from "@tcg/lorcana-types";

export const gantuGalacticFederationCaptain: CharacterCard = {
  id: "c3k",
  cardType: "character",
  name: "Gantu",
  version: "Galactic Federation Captain",
  fullName: "Gantu - Galactic Federation Captain",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "001",
  text: "UNDER ARREST Characters with cost 2 or less can't challenge your characters.",
  cost: 8,
  strength: 6,
  willpower: 6,
  lore: 2,
  cardNumber: 178,
  inkable: true,
  externalIds: {
    ravensburger: "2b9addfb94c8f45cfa1bb249ef2d1021ddee733e",
  },
  abilities: [
    {
      id: "c3k-1",
      text: "UNDER ARREST Characters with cost 2 or less can't challenge your characters.",
      name: "UNDER ARREST",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        target: "SELF",
      },
    },
  ],
  classifications: ["Storyborn", "Alien", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { charactersWithCostXorLessCantChallenge } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const gantuGalacticFederationCaptain: LorcanitoCharacterCard = {
//   id: "ucw",
//
//   name: "Gantu",
//   title: "Galactic Federation Captain",
//   characteristics: ["alien", "storyborn", "captain"],
//   text: "**Under arrest** Characters with cost 2 or less can't challenge your characters.",
//   type: "character",
//   abilities: [
//     charactersWithCostXorLessCantChallenge({
//       name: "Under arrest",
//       text: "Characters with cost 2 or less can't challenge your characters.",
//       cost: 2,
//     }),
//   ],
//   flavour: '"Relax, enjoy the trip... and don\'t get any ideas!"',
//   inkwell: true,
//   colors: ["steel"],
//   cost: 8,
//   strength: 6,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Luis Huerta",
//   number: 178,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 488097,
//   },
//   rarity: "legendary",
// };
//
