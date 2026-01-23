import type { CharacterCard } from "@tcg/lorcana-types";

export const abuBoldHelmsman: CharacterCard = {
  id: "1f2",
  cardType: "character",
  name: "Abu",
  version: "Bold Helmsman",
  fullName: "Abu - Bold Helmsman",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "006",
  text: "Rush (This character can challenge the turn they’re played.)",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 114,
  inkable: false,
  externalIds: {
    ravensburger: "b875bd5dc6364f60d60d0e20e53a61eb2a7eb097",
  },
  abilities: [
    {
      id: "1f2-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { rushAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const abuBoldHelmsman: LorcanitoCharacterCard = {
//   id: "qts",
//   name: "Abu",
//   title: "Bold Helmsman",
//   characteristics: ["storyborn", "ally"],
//   text: "Rush (This character can challenge the turn they’re played.)",
//   type: "character",
//   abilities: [rushAbility],
//   inkwell: false,
//   colors: ["ruby"],
//   cost: 5,
//   strength: 4,
//   willpower: 4,
//   lore: 2,
//   illustrator: "OggysonArt",
//   number: 114,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 592025,
//   },
//   rarity: "common",
// };
//
