import type { CharacterCard } from "@tcg/lorcana-types";

export const snowannaRainbeauCoolCompetitor: CharacterCard = {
  id: "rgl",
  cardType: "character",
  name: "Snowanna Rainbeau",
  version: "Cool Competitor",
  fullName: "Snowanna Rainbeau - Cool Competitor",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "005",
  text: "Rush (This character can challenge the turn they're played.)",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 110,
  inkable: false,
  externalIds: {
    ravensburger: "62f8f59f90124ef9f0b9787ccf4611aaf361be9f",
  },
  abilities: [
    {
      id: "rgl-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
  ],
  classifications: ["Storyborn", "Ally", "Racer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { rushAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const snowannaRainbeauCoolCompetitor: LorcanitoCharacterCard = {
//   id: "ibm",
//   name: "Snowanna Rainbeau",
//   title: "Cool Competitor",
//   characteristics: ["storyborn", "ally", "racer"],
//   text: "**Rush** _(This character can challenge the turn they’re played.)_",
//   type: "character",
//   abilities: [rushAbility],
//   flavour: "When it comes to racing, she never gets cold feet.",
//   colors: ["ruby"],
//   cost: 3,
//   strength: 2,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Simangaliso Sibaya",
//   number: 110,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 555268,
//   },
//   rarity: "common",
// };
//
