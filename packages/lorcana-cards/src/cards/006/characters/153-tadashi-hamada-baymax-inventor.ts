import type { CharacterCard } from "@tcg/lorcana-types";

export const tadashiHamadaBaymaxInventor: CharacterCard = {
  id: "16i",
  cardType: "character",
  name: "Tadashi Hamada",
  version: "Baymax Inventor",
  fullName: "Tadashi Hamada - Baymax Inventor",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "LET'S GET BACK TO WORK This character gets +1 {S} and +1 {W} for each item you have in play.",
  cost: 6,
  strength: 3,
  willpower: 3,
  lore: 3,
  cardNumber: 153,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "993aaea8ad85362fb36241b749ab1bd73d13fdc7",
  },
  abilities: [],
  classifications: ["Storyborn", "Mentor", "Inventor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { forEachItemYouHaveInPlay } from "@lorcanito/lorcana-engine/abilities/amounts";
// import { propertyStaticAbilities } from "../../../abilities/propertyStaticAbilities";
//
// export const tadashiHamadaBaymaxInventor: LorcanitoCharacterCard = {
//   id: "vot",
//   name: "Tadashi Hamada",
//   title: "Baymax Inventor",
//   characteristics: ["storyborn", "mentor", "inventor"],
//   text: "LET'S GET BACK TO WORK This character gets +1 {S} and +1 {W} for each item you have in play.",
//   type: "character",
//   abilities: [
//     propertyStaticAbilities({
//       name: "Let's Get Back To Work",
//       text: "This character gets +1 {S} and +1 {W} for each item you have in play.",
//       attribute: "strength",
//       amount: forEachItemYouHaveInPlay,
//     }),
//     propertyStaticAbilities({
//       name: "Let's Get Back To Work",
//       text: "This character gets +1 {S} and +1 {W} for each item you have in play.",
//       attribute: "willpower",
//       amount: forEachItemYouHaveInPlay,
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 6,
//   strength: 3,
//   willpower: 3,
//   lore: 3,
//   illustrator: "Jeanne Ploumevez",
//   number: 153,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588327,
//   },
//   rarity: "super_rare",
// };
//
