import type { CharacterCard } from "@tcg/lorcana-types";

export const zazuAdvisorToMufasa: CharacterCard = {
  id: "7uk",
  cardType: "character",
  name: "Zazu",
  version: "Advisor to Mufasa",
  fullName: "Zazu - Advisor to Mufasa",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "005",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 72,
  inkable: true,
  externalIds: {
    ravensburger: "1c49ac7ff34fcbbbd4e8e2c2cc50bc858e2cb391",
  },
  abilities: [
    {
      id: "7uk-1",
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
// export const zazuAdvisorToMufasa: LorcanitoCharacterCard = {
//   id: "g60",
//   name: "Zazu",
//   title: "Advisor to Mufasa",
//   characteristics: ["storyborn", "ally"],
//   text: "**Evasive** _(Only characters with Evasive can challenge this character)._",
//   type: "character",
//   abilities: [evasiveAbility],
//   flavour: "Oh, I guess one quick spin through the lights won’t hurt.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 5,
//   strength: 3,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Kuya Jaypi",
//   number: 72,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561497,
//   },
//   rarity: "common",
// };
//
