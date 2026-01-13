import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanEnemyOfEntanglement: CharacterCard = {
  id: "1p7",
  cardType: "character",
  name: "Mulan",
  version: "Enemy of Entanglement",
  fullName: "Mulan - Enemy of Entanglement",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "004",
  text: "TIME TO SHINE Whenever you play an action, this character gets +2 {S} this turn.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 115,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dc42755db5ece09465c9e80da08501b1ee99e7d1",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const mulanEnemyOfEntanglement: LorcanitoCharacterCard = {
//   id: "ums",
//   name: "Mulan",
//   title: "Enemy of Entanglement",
//   characteristics: ["hero", "storyborn", "princess"],
//   text: "**TIME TO SHINE** Whenever you play an action, this character gets +2 {S} this turn.",
//   type: "character",
//   abilities: [
//     wheneverPlays({
//       name: "TIME TO SHINE",
//       text: "Whenever you play an action, this character gets +2 {S} this turn.",
//       triggerTarget: {
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "action" },
//           { filter: "characteristics", value: ["action"] },
//           { filter: "owner", value: "self" },
//         ],
//       },
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           modifier: "add",
//           amount: 2,
//           duration: "turn",
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   flavour: "Ursula's messengers fled, leaving behind tendrils of dark ink.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Jared Mathews",
//   number: 115,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547645,
//   },
//   rarity: "uncommon",
// };
//
