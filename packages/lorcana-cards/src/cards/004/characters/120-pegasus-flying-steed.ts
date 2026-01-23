import type { CharacterCard } from "@tcg/lorcana-types";

export const pegasusFlyingSteed: CharacterCard = {
  id: "dxe",
  cardType: "character",
  name: "Pegasus",
  version: "Flying Steed",
  fullName: "Pegasus - Flying Steed",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "004",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  cardNumber: 120,
  inkable: true,
  externalIds: {
    ravensburger: "3232a625c1ad1451c0bd29fcfbc149d3d2a38166",
  },
  abilities: [
    {
      id: "dxe-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const pegasusFlyingSteed: LorcanitoCharacterCard = {
//   id: "u8h",
//   name: "Pegasus",
//   title: "Flying Steed",
//   characteristics: ["ally", "storyborn"],
//   text: "**Evasive** _(Only characters with Evasive can challenge this character.)_",
//   type: "character",
//   abilities: [evasiveAbility],
//   flavour: "It zigs, it zags, what else do you need? \n−Phil",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 3,
//   willpower: 1,
//   lore: 1,
//   illustrator: "Kenneth Anderson",
//   number: 120,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550597,
//   },
//   rarity: "common",
// };
//
