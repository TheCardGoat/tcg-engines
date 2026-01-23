import type { CharacterCard } from "@tcg/lorcana-types";

export const chiefTuiRespectedLeader: CharacterCard = {
  id: "qai",
  cardType: "character",
  name: "Chief Tui",
  version: "Respected Leader",
  fullName: "Chief Tui - Respected Leader",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "001",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 3,
  cardNumber: 143,
  inkable: true,
  externalIds: {
    ravensburger: "5ec21d0830840f21954cd2a68de6906e36a893ed",
  },
  abilities: [
    {
      id: "qai-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
  ],
  classifications: ["Storyborn", "Mentor", "King"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const chiefTui: LorcanitoCharacterCard = {
//   id: "ugn",
//
//   name: "Chief Tui",
//   title: "Respected Leader",
//   characteristics: ["storyborn", "king", "mentor"],
//   text: "**Support** _(Whenever this character quests, you\u0003 may add their {S} to another chosen character's {S} this turn.)_",
//   type: "character",
//   abilities: [supportAbility],
//   illustrator: "Pirel",
//   flavour: "You can always rely on the strength of those who love you.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 7,
//   strength: 3,
//   willpower: 6,
//   lore: 3,
//   number: 143,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508819,
//   },
//   rarity: "uncommon",
// };
//
