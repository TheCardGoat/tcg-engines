import type { CharacterCard } from "@tcg/lorcana-types";

export const cogsworthTalkingClock: CharacterCard = {
  id: "y7r",
  cardType: "character",
  name: "Cogsworth",
  version: "Talking Clock",
  fullName: "Cogsworth - Talking Clock",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "WAIT A MINUTE Your characters with Reckless gain “{E} — Gain 1 lore.”",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 143,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7b50975b1d3f12da9b7fe8822eb27ad690318c58",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const cogsworthTalkingClock: LorcanitoCharacterCard = {
//   id: "ozp",
//   name: "Cogsworth",
//   title: "Talking Clock",
//   characteristics: ["storyborn", "ally"],
//   text: "**WAIT A MINUTE** Your character with **Reckless** gain {E} − Gain 1 lore.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "Wait a Minute",
//       text: "Your character with **Reckless** gain {E} − Gain 1 lore.",
//       gainedAbility: {
//         type: "activated",
//         costs: [{ type: "exert" }],
//         optional: false,
//         name: "Wait a Minute",
//         text: "{E} − Gain 1 lore.",
//         effects: [
//           {
//             type: "lore",
//             modifier: "add",
//             amount: 1,
//             target: self,
//           },
//         ],
//       } as ActivatedAbility,
//       target: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "zone", value: "play" },
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "self" },
//           { filter: "ability", value: "reckless" },
//         ],
//       },
//     },
//   ],
//   flavour: "This has gone far enough. I'm charge here.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Leonardo Giammichele",
//   number: 143,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 517592,
//   },
//   rarity: "uncommon",
// };
//
