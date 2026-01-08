import type { CharacterCard } from "@tcg/lorcana-types";

export const mullinsSeasonedShipmate: CharacterCard = {
  id: "meu",
  cardType: "character",
  name: "Mullins",
  version: "Seasoned Shipmate",
  fullName: "Mullins - Seasoned Shipmate",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "006",
  text: "FALL IN LINE While you have a character named Mr. Smee in play, this character gains Resist +1. (Damage dealt to them is reduced by 1.)",
  cost: 5,
  strength: 6,
  willpower: 4,
  lore: 1,
  cardNumber: 177,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "50c699882acf4c49f535574ca8c8d34101ab6ff3",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Pirate"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { resistAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whileYouHaveACharacterNamedThisCharGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const mullinsSeasonedShipmate: LorcanitoCharacterCard = {
//   id: "k41",
//   name: "Mullins",
//   title: "Seasoned Shipmate",
//   characteristics: ["storyborn", "ally", "pirate"],
//   text: "FALL IN LINE While you have a character named Mr. Smee in play, this character gains Resist +1. (Damage dealt to them is reduced by 1.)",
//   type: "character",
//   abilities: [
//     whileYouHaveACharacterNamedThisCharGains({
//       name: "Fall in Line",
//       text: "While you have a character named Mr. Smee in play, this character gains Resist +1. (Damage dealt to them is reduced by 1.)",
//       characterName: "Mr. Smee",
//       ability: resistAbility(1),
//     }),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 5,
//   strength: 6,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Federico Maria Cugliari",
//   number: 177,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 592011,
//   },
//   rarity: "common",
// };
//
