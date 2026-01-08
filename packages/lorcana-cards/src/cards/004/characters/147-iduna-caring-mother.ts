import type { CharacterCard } from "@tcg/lorcana-types";

export const idunaCaringMother: CharacterCard = {
  id: "178",
  cardType: "character",
  name: "Iduna",
  version: "Caring Mother",
  fullName: "Iduna - Caring Mother",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "004",
  text: "ENDURING LOVE When this character is banished, you may put this card into your inkwell facedown and exerted.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 147,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9bd57fcb99a507768c2ed76d095a7b67706581f7",
  },
  abilities: [],
  classifications: ["Storyborn", "Mentor", "Queen"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { putThisCardIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const idunaCaringMother: LorcanitoCharacterCard = {
//   id: "oj8",
//   name: "Iduna",
//   title: "Caring Mother",
//   characteristics: ["queen", "storyborn", "mentor"],
//   text: "**ENDURING LOVE** When this character is banished, you may put this card into your inkwell facedown and exerted.",
//   type: "character",
//   abilities: [
//     whenThisCharacterBanished({
//       name: "Enduring Love",
//       text: "When this character is banished, you may put this card into your inkwell facedown and exerted.",
//       optional: true,
//       effects: [putThisCardIntoYourInkwellExerted],
//     }),
//   ],
//   flavour:
//     "Come my darling, homeward bound\nWhen all is lost, then all is found.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Jake Murphy",
//   number: 147,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550607,
//   },
//   rarity: "uncommon",
// };
//
