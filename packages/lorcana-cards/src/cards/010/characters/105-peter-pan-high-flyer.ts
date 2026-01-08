import type { CharacterCard } from "@tcg/lorcana-types";

export const peterPanHighFlyer: CharacterCard = {
  id: "1sq",
  cardType: "character",
  name: "Peter Pan",
  version: "High Flyer",
  fullName: "Peter Pan - High Flyer",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "010",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  cardNumber: 105,
  inkable: true,
  externalIds: {
    ravensburger: "067ac8173c1f60f06e456367ff8785feaa83214f",
  },
  abilities: [
    {
      id: "1sq-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const peterPanHighFlyer: LorcanitoCharacterCard = {
//   id: "rp8",
//   name: "Peter Pan",
//   title: "High Flyer",
//   characteristics: ["storyborn", "hero"],
//   text: "Evasive (Only characters with Evasive can challenge this character.)",
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 1,
//   willpower: 3,
//   illustrator: "Marcel Berg",
//   number: 105,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659189,
//   },
//   rarity: "common",
//   abilities: [evasiveAbility],
//   lore: 2,
// };
//
