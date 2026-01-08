import type { CharacterCard } from "@tcg/lorcana-types";

export const herculesDivineHero: CharacterCard = {
  id: "5e9",
  cardType: "character",
  name: "Hercules",
  version: "Divine Hero",
  fullName: "Hercules - Divine Hero",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "002",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Hercules.)\nResist +2 (Damage dealt to this character is reduced by 2.)",
  cost: 6,
  strength: 6,
  willpower: 3,
  lore: 2,
  cardNumber: 181,
  inkable: true,
  externalIds: {
    ravensburger: "1372c6d5229587e89693707e53401c018887b762",
  },
  abilities: [
    {
      id: "5e9-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4",
    },
    {
      id: "5e9-2",
      type: "keyword",
      keyword: "Resist",
      value: 2,
      text: "Resist +2",
    },
  ],
  classifications: ["Floodborn", "Hero", "Prince", "Deity"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   resistAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const herculesDivineHero: LorcanitoCharacterCard = {
//   id: "e0i",
//   name: "Hercules",
//   title: "Divine Hero",
//   characteristics: ["hero", "floodborn", "deity", "prince"],
//   text: "**Shift** 4 _You may pay 4 {I} to play this on top of one of your characters named Hercules.)_\n\n**Resist** +2 _(Damage dealt to this character is reduced by 2.)_",
//   type: "character",
//   abilities: [shiftAbility(4, "hercules"), resistAbility(2)],
//   flavour: "A good guy to have around when something wrecks your inkworks.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 6,
//   strength: 6,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Grace Tran",
//   number: 181,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527532,
//   },
//   rarity: "rare",
// };
//
