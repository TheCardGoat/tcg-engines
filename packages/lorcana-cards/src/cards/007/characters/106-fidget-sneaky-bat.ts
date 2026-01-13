import type { CharacterCard } from "@tcg/lorcana-types";

export const fidgetSneakyBat: CharacterCard = {
  id: "1lo",
  cardType: "character",
  name: "Fidget",
  version: "Sneaky Bat",
  fullName: "Fidget - Sneaky Bat",
  inkType: ["emerald", "ruby"],
  franchise: "Great Mouse Detective",
  set: "007",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nI TOOK CARE OF EVERYTHING Whenever this character quests, another chosen character of yours gains Evasive until the start of your next turn.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 106,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cfdd9e04d6917aac14c9f8b2e100a587bf16ce09",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const fidgetSneakyBat: LorcanitoCharacterCard = {
//   id: "zgb",
//   name: "Fidget",
//   title: "Sneaky Bat",
//   characteristics: ["storyborn", "ally"],
//   text: "EVASIVE\nI TOOK CARE OF EVERYTHING Whenever this character quests, another chosen character of yours gain Evasive until the start of your next turn.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     wheneverQuests({
//       name: "TOOK CARE OF EVERYTHING",
//       text: "Whenever this character quests, another chosen character of yours gain Evasive until the start of your next turn.",
//       effects: [
//         {
//           type: "ability",
//           ability: "evasive",
//           modifier: "add",
//           duration: "next_turn",
//           until: true,
//           target: chosenCharacterOfYours,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//
//   colors: ["emerald", "ruby"],
//   cost: 4,
//   strength: 2,
//   willpower: 3,
//   illustrator: "Ian MacDonald",
//   number: 106,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619464,
//   },
//   rarity: "uncommon",
//   lore: 2,
// };
//
