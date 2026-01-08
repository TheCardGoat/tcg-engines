import type { CharacterCard } from "@tcg/lorcana-types";

export const eilonwyPrincessOfLlyr: CharacterCard = {
  id: "49a",
  cardType: "character",
  name: "Eilonwy",
  version: "Princess of Llyr",
  fullName: "Eilonwy - Princess of Llyr",
  inkType: ["amber"],
  franchise: "Black Cauldron",
  set: "010",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 7,
  inkable: true,
  externalIds: {
    ravensburger: "0f58ea02eaf39ac3ef2bc75f001ad1d539b477ed",
  },
  abilities: [
    {
      id: "49a-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
  ],
  classifications: ["Storyborn", "Ally", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const eilonwyPrincessOfLlyr: LorcanitoCharacterCard = {
//   id: "ttt",
//   name: "Eilonwy",
//   title: "Princess of Llyr",
//   characteristics: ["storyborn", "ally", "princess"],
//   text: "Support",
//   type: "character",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   strength: 2,
//   willpower: 1,
//   illustrator: "Pix Smith",
//   number: 7,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659763,
//   },
//   rarity: "common",
//   abilities: [supportAbility],
//   lore: 1,
// };
//
