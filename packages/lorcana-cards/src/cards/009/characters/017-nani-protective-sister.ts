import type { CharacterCard } from "@tcg/lorcana-types";

export const naniProtectiveSister: CharacterCard = {
  id: "1fn",
  cardType: "character",
  name: "Nani",
  version: "Protective Sister",
  fullName: "Nani - Protective Sister",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "009",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 17,
  inkable: true,
  externalIds: {
    ravensburger: "ba2f05538e1999601db469cfe0b44f78bcbdb61c",
  },
  abilities: [
    {
      id: "1fn-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { naniProtectiveSister as ogNaniProtectiveSister } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
//
// export const naniProtectiveSister: LorcanitoCharacterCard = {
//   ...ogNaniProtectiveSister,
//   id: "pws",
//   reprints: [ogNaniProtectiveSister.id],
//   number: 17,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649965,
//   },
// };
//
