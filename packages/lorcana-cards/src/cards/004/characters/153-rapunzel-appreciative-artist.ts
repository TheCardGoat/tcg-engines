import type { CharacterCard } from "@tcg/lorcana-types";

export const rapunzelAppreciativeArtist: CharacterCard = {
  id: "1qj",
  cardType: "character",
  name: "Rapunzel",
  version: "Appreciative Artist",
  fullName: "Rapunzel - Appreciative Artist",
  inkType: ["sapphire"],
  franchise: "Tangled",
  set: "004",
  text: "PERCEPTIVE PARTNER While you have a character named Pascal in play, this character gains Ward. (Opponents can't choose them except to challenge.)",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 3,
  cardNumber: 153,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e162ea6cf826b5a99f57c8b44073d06f84dc6995",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whileYouHaveACharacterNamedThisCharGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const rapunzelAppreciativeArtist: LorcanitoCharacterCard = {
//   id: "jzp",
//   missingTestCase: true,
//   name: "Rapunzel",
//   title: "Appreciative Artist",
//   characteristics: ["hero", "dreamborn", "princess"],
//   text: "**PERCEPTIVE PARTNER** While you have a character named Pascal in play, this character gains **Ward.** _(Opponents can't chose them except to challenge.)_",
//   type: "character",
//   abilities: [
//     whileYouHaveACharacterNamedThisCharGains({
//       name: "Perceptive Partner",
//       text: "While you have a character named Pascal in play, this character gains **Ward.** _(Opponents can't chose them except to challenge.)_",
//       characterName: "Pascal",
//       ability: wardAbility,
//     }),
//   ],
//   flavour: '"Pascal! A new flower for the wall!"',
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 5,
//   strength: 3,
//   willpower: 5,
//   lore: 3,
//   illustrator: "Aubrey Archer",
//   number: 153,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 543915,
//   },
//   rarity: "rare",
// };
//
