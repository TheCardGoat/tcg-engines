import type { CharacterCard } from "@tcg/lorcana-types";

export const sleepySluggishKnight: CharacterCard = {
  id: "1k0",
  cardType: "character",
  name: "Sleepy",
  version: "Sluggish Knight",
  fullName: "Sleepy - Sluggish Knight",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  cardNumber: 177,
  inkable: true,
  externalIds: {
    ravensburger: "c9ec3115210a0d6350a7df1c16405f550b05b3cd",
  },
  abilities: [
    {
      id: "1k0-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const sleepySluggishKnight: LorcanitoCharacterCard = {
//   id: "zvc",
//   name: "Sleepy",
//   title: "Sluggish Knight",
//   characteristics: ["dreamborn", "ally", "knight", "seven dwarfs"],
//   text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
//   type: "character",
//   abilities: [bodyguardAbility],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   willpower: 4,
//   strength: 0,
//   lore: 1,
//   illustrator: "Wouter Bruenel",
//   number: 177,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559664,
//   },
//   rarity: "uncommon",
// };
//
