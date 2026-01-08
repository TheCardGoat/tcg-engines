import type { CharacterCard } from "@tcg/lorcana-types";

export const liloBestExplorerEver: CharacterCard = {
  id: "127",
  cardType: "character",
  name: "Lilo",
  version: "Best Explorer Ever",
  fullName: "Lilo - Best Explorer Ever",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "009",
  text: "COME ON, PEOPLE, LET'S MOVE When you play this character, your other characters gain Challenger +2 this turn (They get +2 {S} while challenging.)\nGO GET 'EM Whenever this character quests, chosen Alien character gains Challenger +2 and \"This character can challenge ready characters\" this turn.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 174,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "89a9cf3060e267f03223e97c6bd0ec7ab0072c80",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { challengerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { yourOtherCharacters } from "@lorcanito/lorcana-engine/abilities/target";
// import {
//   chosenAlienCharacter,
//   yourCharacters,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const liloBestExplorerEver: LorcanitoCharacterCard = {
//   id: "lbe",
//   name: "Lilo",
//   title: "Best Explorer Ever",
//   characteristics: ["storyborn", "hero"],
//   text: "COME ON, PEOPLE, LET'S MOVE When you play this character, your other characters gain Challenger +2 this turn. \nGO GET 'EM Whenever this character quests, chosen Alien character gains Challenger +2 and \"This character can challenge ready characters\" this turn.",
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 2,
//   willpower: 2,
//   illustrator: "",
//   number: 174,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649222,
//   },
//   rarity: "common",
//   abilities: [
//     {
//       type: "resolution",
//       name: "COME ON, PEOPLE, LET'S MOVE",
//       text: "When you play this character, your other characters gain Challenger +2 this turn.",
//       effects: [
//         {
//           type: "ability",
//           ability: "custom",
//           modifier: "add",
//           duration: "turn",
//           until: true,
//           target: yourOtherCharacters,
//           customAbility: challengerAbility(2),
//         },
//       ],
//     },
//     wheneverThisCharacterQuests({
//       effects: [
//         {
//           type: "ability",
//           ability: "custom",
//           modifier: "add",
//           duration: "turn",
//           until: true,
//           target: chosenAlienCharacter,
//           customAbility: challengerAbility(2),
//         },
//         {
//           type: "ability",
//           ability: "challenge_ready_chars",
//           modifier: "add",
//           duration: "turn",
//           until: true,
//           target: chosenAlienCharacter,
//         },
//       ],
//     }),
//   ],
//   lore: 1,
// };
//
