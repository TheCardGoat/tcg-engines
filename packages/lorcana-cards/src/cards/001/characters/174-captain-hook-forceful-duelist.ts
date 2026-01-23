import type { CharacterCard } from "@tcg/lorcana-types";

export const captainHookForcefulDuelist: CharacterCard = {
  id: "uk5",
  cardType: "character",
  name: "Captain Hook",
  version: "Forceful Duelist",
  fullName: "Captain Hook - Forceful Duelist",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "**Challenger** +2 (_While challenging, this character get +2 {S}._)",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 174,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "static",
      text: "**Challenger** +2 (_While challenging, this character get +2 {S}._)",
      id: "uk5-1",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
    },
  ],
  classifications: ["Dreamborn", "Villain", "Pirate", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ChallengerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const captainHookForcefulDuelist: LorcanitoCharacterCard = {
//   id: "uk5",
//   reprints: ["whb"],
//   name: "Captain Hook",
//   title: "Forceful Duelist",
//   characteristics: ["dreamborn", "villain", "pirate", "captain"],
//   text: "**Challenger** +2 (_While challenging, this character get +2 {S}._)",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "challenger",
//       value: 2,
//       text: "**Challenger** +2 (_When challenging, this character get +2 {S}._)",
//     } as ChallengerAbility,
//   ],
//   flavour: "He loves to make light of a foe's predicament.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 1,
//   strength: 1,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Marcel Berg",
//   number: 174,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492704,
//   },
//   rarity: "common",
// };
//
