import type { CharacterCard } from "@tcg/lorcana-types";

export const fidgetRatigansHenchman: CharacterCard = {
  id: "168",
  cardType: "character",
  name: "Fidget",
  version: "Ratigan's Henchman",
  fullName: "Fidget - Ratigan's Henchman",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 108,
  inkable: true,
  externalIds: {
    ravensburger: "9836b26ae57048c3c2225cde40cc9be4712fc633",
  },
  abilities: [
    {
      id: "168-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const fidgetRatigansHenchman: LorcanitoCharacterCard = {
//   id: "p8b",
//   name: "Fidget",
//   title: "Ratigan's Henchman",
//   characteristics: ["dreamborn", "ally"],
//   text: "**Evasive** _(Only characters with Evasive can challenge this character.)_",
//   type: "character",
//   abilities: [evasiveAbility],
//   flavour: "When a normal henchman just won't cut it.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 3,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Giulia Riva",
//   number: 108,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527274,
//   },
//   rarity: "common",
// };
//
