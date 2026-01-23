import type { CharacterCard } from "@tcg/lorcana-types";

export const heiheiProtectiveRooster: CharacterCard = {
  id: "9lo",
  cardType: "character",
  name: "HeiHei",
  version: "Protective Rooster",
  fullName: "HeiHei - Protective Rooster",
  inkType: ["steel"],
  franchise: "Moana",
  set: "005",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 179,
  inkable: true,
  externalIds: {
    ravensburger: "229b50a7f3386e0bd2aa989a726fa7a22826eee1",
  },
  abilities: [
    {
      id: "9lo-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const heiheiProtectiveRooster: LorcanitoCharacterCard = {
//   id: "l2b",
//   name: "HeiHei",
//   title: "Protective Rooster",
//   characteristics: ["dreamborn", "ally"],
//   text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your character must chose one with Bodyguard if able.)_",
//   type: "character",
//   abilities: [bodyguardAbility],
//   flavour: 'Who’s the "boat snack" now?!',
//   inkwell: true,
//   colors: ["steel"],
//   cost: 5,
//   strength: 4,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Brian Weisz",
//   number: 179,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561158,
//   },
//   rarity: "common",
// };
//
