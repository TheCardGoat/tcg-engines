import type { CharacterCard } from "@tcg/lorcana-types";

export const kronkUnlicensedInvestigator: CharacterCard = {
  id: "kit",
  cardType: "character",
  name: "Kronk",
  version: "Unlicensed Investigator",
  fullName: "Kronk - Unlicensed Investigator",
  inkType: ["steel"],
  franchise: "Emperors New Groove",
  set: "005",
  text: "Challenger +1 (While challenging, this character gets +1 {S}.)",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 178,
  inkable: true,
  externalIds: {
    ravensburger: "020df7caff144b7a745a51d6252d5a5861fb6489",
  },
  abilities: [
    {
      id: "kit-1",
      type: "keyword",
      keyword: "Challenger",
      value: 1,
      text: "Challenger +1",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { challengerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const kronkUnlicensedInvestigator: LorcanitoCharacterCard = {
//   id: "ylc",
//   name: "Kronk",
//   title: "Unlicensed Investigator",
//   characteristics: ["dreamborn", "ally"],
//   text: "**Challenger**  +1 _(While challenging, this character gets +1 {S}.)_",
//   type: "character",
//   abilities: [challengerAbility(1)],
//   flavour:
//     "Maybe this one’s a chromicon. Probably not. I really should have paid more attention when that wizard guy was talking . . .",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   strength: 1,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Alex Accorsi",
//   number: 178,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561492,
//   },
//   rarity: "common",
// };
//
