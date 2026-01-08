import type { CharacterCard } from "@tcg/lorcana-types";

export const inspectorTezukaResoluteOfficer: CharacterCard = {
  id: "15o",
  cardType: "character",
  name: "Inspector Tezuka",
  version: "Resolute Officer",
  fullName: "Inspector Tezuka - Resolute Officer",
  inkType: ["steel"],
  franchise: "Ducktales",
  set: "010",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 177,
  inkable: true,
  externalIds: {
    ravensburger: "9644b567eec1691484deb7950ab8728fb6fdc9a8",
  },
  abilities: [
    {
      id: "15o-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
  ],
  classifications: ["Storyborn", "Ally", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const inspectorTezukaResoluteOfficer: LorcanitoCharacterCard = {
//   id: "e5q",
//   name: "Inspector Tezuka",
//   title: "Resolute Officer",
//   characteristics: ["storyborn", "ally", "detective"],
//   text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   strength: 2,
//   willpower: 3,
//   illustrator: "SOWSOW",
//   number: 177,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659404,
//   },
//   rarity: "common",
//   abilities: [bodyguardAbility],
//   lore: 1,
// };
//
