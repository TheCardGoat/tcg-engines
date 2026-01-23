import type { CharacterCard } from "@tcg/lorcana-types";

export const bashfulAdoringKnight: CharacterCard = {
  id: "gwv",
  cardType: "character",
  name: "Bashful",
  version: "Adoring Knight",
  fullName: "Bashful - Adoring Knight",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  text: "IMPRESS THE PRINCESS While you have a character named Snow White in play, this character gains Bodyguard. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 189,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3cf4b19a2648e56f2b033173866e792f12a00589",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whileYouHaveACharacterNamedThisCharGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const bashfulAdoringKnight: LorcanitoCharacterCard = {
//   id: "q7u",
//   missingTestCase: true,
//   name: "Bashful",
//   title: "Adoring Knight",
//   characteristics: ["dreamborn", "ally", "knight", "seven dwarfs"],
//   text: "**IMPRESS THE PRINCESS** While you have a character named Snow White in play, this character gains **Bodyguard**. _(An opposing character who challenges one of your character must chose one with Bodyguard if able.)_",
//   type: "character",
//   abilities: [
//     whileYouHaveACharacterNamedThisCharGains({
//       name: "Impress The Princess",
//       text: "While you have a character named Snow White in play, this character gains **Bodyguard**.",
//       ability: bodyguardAbility,
//       characterName: "snow white",
//     }),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Mariana Moreno Ayala",
//   number: 189,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559662,
//   },
//   rarity: "uncommon",
// };
//
