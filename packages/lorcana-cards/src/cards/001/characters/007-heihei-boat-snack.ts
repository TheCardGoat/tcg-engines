import type { CharacterCard } from "@tcg/lorcana-types";

export const heiheiBoatSnack: CharacterCard = {
  id: "uio",
  cardType: "character",
  name: "HeiHei",
  version: "Boat Snack",
  fullName: "HeiHei - Boat Snack",
  inkType: ["amber"],
  franchise: "Moana",
  set: "001",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 7,
  inkable: true,
  externalIds: {
    ravensburger: "6dfdbf904cb6a8f2f700f9839e50902b7dd4bcad",
  },
  abilities: [
    {
      id: "uio-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const heiheiBoatSnack: LorcanitoCharacterCard = {
//   id: "uze",
//   name: "Heihei",
//   title: "Boat Snack",
//   characteristics: ["storyborn", "ally"],
//   text: "**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_",
//   type: "character",
//   abilities: [supportAbility],
//   flavour:
//     "„Sometimes, our strengths lie beneath the surface.\u0003Far beneath, in some cases. . . .",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   strength: 1,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Jenna Gray",
//   number: 7,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 493479,
//   },
//   rarity: "common",
// };
//
