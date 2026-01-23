import type { CharacterCard } from "@tcg/lorcana-types";

export const beagleBoysSmalltimeCrooks: CharacterCard = {
  id: "f1x",
  cardType: "character",
  name: "Beagle Boys",
  version: "Small-Time Crooks",
  fullName: "Beagle Boys - Small-Time Crooks",
  inkType: ["ruby", "sapphire"],
  franchise: "Ducktales",
  set: "007",
  text: "HURRY IT UP! Whenever this character quests, chosen character of yours gains Rush and Resist +1 this turn. (They can challenge the turn they're played. Damage dealt to them is reduced by 1.)",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 132,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3640f3d03075b83c26d1c507eb09571e3f2a2efa",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const beagleBoysSmalltimeCrooks: LorcanitoCharacterCard = {
//   id: "szr",
//   name: "Beagle Boys",
//   title: "Small-Time Crooks",
//   characteristics: ["storyborn", "villain"],
//   text: "HURRY IT UP! Whenever this character quests, chosen character of yours gains Rush and Resist +1 this turn. (They can challenge the turn they're played. Damage dealt to them is reduced by 1.)",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "HURRY IT UP!",
//       text: "Whenever this character quests, chosen character of yours gains Rush and Resist +1 this turn. (They can challenge the turn they're played. Damage dealt to them is reduced by 1.)",
//       effects: [
//         {
//           type: "ability",
//           ability: "rush",
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacterOfYours,
//         },
//         {
//           type: "ability",
//           ability: "resist",
//           amount: 1,
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacterOfYours,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby", "sapphire"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Laura Bonger",
//   number: 132,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619478,
//   },
//   rarity: "uncommon",
//   lore: 2,
// };
//
