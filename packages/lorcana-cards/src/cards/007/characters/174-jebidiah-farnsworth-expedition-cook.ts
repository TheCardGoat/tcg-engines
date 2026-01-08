import type { CharacterCard } from "@tcg/lorcana-types";

export const jebidiahFarnsworthExpeditionCook: CharacterCard = {
  id: "1z1",
  cardType: "character",
  name: "Jebidiah Farnsworth",
  version: "Expedition Cook",
  fullName: "Jebidiah Farnsworth - Expedition Cook",
  inkType: ["sapphire"],
  franchise: "Atlantis",
  set: "007",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nI GOT YOUR FOUR BASIC FOOD GROUPS When you play this character, chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 174,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "fffdd033322affbd2f0dbae5b6b9b13ef3984c6a",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const jebidiahFarnsworthExpeditionCook: LorcanitoCharacterCard = {
//   id: "i78",
//   name: "Jebidiah Farnsworth",
//   title: "Expedition Cook",
//   characteristics: ["storyborn", "ally"],
//   text: "Support\nI GOT YOUR FOUR BASIC FOOD GROUPS When you play this character, chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
//   type: "character",
//   abilities: [
//     supportAbility,
//     {
//       type: "resolution",
//       name: "I GOT YOUR FOUR BASIC FOOD GROUPS",
//       text: "When you play this character, chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
//       effects: [
//         {
//           type: "ability",
//           ability: "resist",
//           amount: 1,
//           modifier: "add",
//           duration: "next_turn",
//           until: true,
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Pix Smith",
//   number: 174,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619506,
//   },
//   rarity: "uncommon",
//   lore: 1,
// };
//
