import type { CharacterCard } from "@tcg/lorcana-types";

export const theSultanPlayfulMonarch: CharacterCard = {
  id: "19m",
  cardType: "character",
  name: "The Sultan",
  version: "Playful Monarch",
  fullName: "The Sultan - Playful Monarch",
  inkType: ["sapphire"],
  franchise: "Aladdin",
  set: "010",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 2,
  cardNumber: 151,
  inkable: false,
  vanilla: true,
  externalIds: {
    ravensburger: "a47af3a9eb3ec02f68da3da7984362926799fdcd",
  },
  classifications: ["Storyborn", "Ally", "King"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const theSultanPlayfulMonarch: LorcanitoCharacterCard = {
//   id: "pc7",
//   name: "The Sultan",
//   title: "Playful Monarch",
//   characteristics: ["storyborn", "ally", "king"],
//   text: "",
//   type: "character",
//   inkwell: false,
//   colors: ["sapphire"],
//   cost: 1,
//   strength: 1,
//   willpower: 1,
//   illustrator: 'Victor "Yano" Covarrubias',
//   number: 151,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659416,
//   },
//   rarity: "rare",
//   abilities: [],
//   lore: 2,
// };
//
