import type { CharacterCard } from "@tcg/lorcana-types";

export const pigletSturdySwordsman: CharacterCard = {
  id: "1bb",
  cardType: "character",
  name: "Piglet",
  version: "Sturdy Swordsman",
  fullName: "Piglet - Sturdy Swordsman",
  inkType: ["steel"],
  franchise: "Winnie the Pooh",
  set: "004",
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)\nNOT SO SMALL ANYMORE While you have no cards in your hand, this character can challenge ready characters.",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 3,
  cardNumber: 191,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "aa5bef4f5a3c18bd9740e3b9f58fa1de1b683cc0",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { resistAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whileYouHaveNoCardsInHandThisCharacterCanChallengeReadyChars } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const pigletSturdySwordsman: LorcanitoCharacterCard = {
//   id: "gau",
//   name: "Piglet",
//   title: "Sturdy Swordsman",
//   characteristics: ["hero", "dreamborn"],
//   text: "**Resist +1** _(Damage dealt to this character is reduced by 1.)_\n\n\n**NOT SO SMALL ANYMORE** While you have no cards in your hand, this character can challenge ready characters.",
//   type: "character",
//   abilities: [
//     resistAbility(1),
//     whileYouHaveNoCardsInHandThisCharacterCanChallengeReadyChars({
//       name: "**NOT SO SMALL ANYMORE**",
//       text: "While you have no cards in your hand, this character can challenge ready characters.",
//     }),
//   ],
//   colors: ["steel"],
//   cost: 5,
//   strength: 3,
//   willpower: 5,
//   lore: 3,
//   illustrator: "Alex Accorsi",
//   number: 191,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550620,
//   },
//   rarity: "legendary",
// };
//
