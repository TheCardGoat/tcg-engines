import type { CharacterCard } from "@tcg/lorcana-types";

export const beastThickskinned: CharacterCard = {
  id: "qz9",
  cardType: "character",
  name: "Beast",
  version: "Thick-Skinned",
  fullName: "Beast - Thick-Skinned",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "004",
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 176,
  inkable: true,
  externalIds: {
    ravensburger: "613c1d6a03168cd893e044a3b018c6d7d70f295d",
  },
  abilities: [
    {
      id: "qz9-1",
      type: "keyword",
      keyword: "Resist",
      value: 1,
      text: "Resist +1",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { resistAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const beastThickSkinned: LorcanitoCharacterCard = {
//   id: "xyo",
//   name: "Beast",
//   title: "Thick-Skinned",
//   characteristics: ["hero", "storyborn", "prince"],
//   text: "**Resist** +1 _(Damage dealt to this character is reduced by 1 )_",
//   type: "character",
//   abilities: [resistAbility(1)],
//   flavour: "He's even tougher than he looks.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Simangaliso Sibaya",
//   number: 176,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549654,
//   },
//   rarity: "common",
// };
//
