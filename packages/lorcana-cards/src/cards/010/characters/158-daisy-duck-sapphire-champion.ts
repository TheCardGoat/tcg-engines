import type { CharacterCard } from "@tcg/lorcana-types";

export const daisyDuckSapphireChampion: CharacterCard = {
  id: "107",
  cardType: "character",
  name: "Daisy Duck",
  version: "Sapphire Champion",
  fullName: "Daisy Duck - Sapphire Champion",
  inkType: ["sapphire"],
  set: "010",
  text: "STAND FAST Your other Sapphire characters gain Resist +1. (Damage dealt to them is reduced by 1.)\nLOOK AHEAD Whenever one of your other Sapphire characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
  cost: 5,
  strength: 5,
  willpower: 6,
  lore: 1,
  cardNumber: 158,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8273e51ca5ba49aaebe8b395cd2687bc0abf59e0",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   gainAbilityWhileHere,
//   resistAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverACharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const daisyDuckSapphireChampion: LorcanitoCharacterCard = {
//   id: "cm9",
//   name: "Daisy Duck",
//   title: "Sapphire Champion",
//   characteristics: ["dreamborn", "hero"],
//   text: "STAND FAST Your other Sapphire characters gain Resist +1. (Damage dealt to them is reduced by 1.) LOOK AHEAD Whenever one of your other Sapphire characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
//   type: "character",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 5,
//   strength: 5,
//   willpower: 6,
//   illustrator: "Lisa Parfenova",
//   number: 158,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659630,
//   },
//   rarity: "rare",
//   lore: 1,
//   abilities: [
//     gainAbilityWhileHere({
//       name: "STAND FAST",
//       text: "Your other Sapphire characters gain Resist +1.",
//       ability: resistAbility(1),
//       target: {
//         type: "card",
//         value: "all",
//         excludeSelf: true,
//         filters: [
//           { filter: "owner", value: "self" },
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           { filter: "color", value: "sapphire" },
//         ],
//       },
//     }),
//     wheneverACharacterQuests({
//       name: "LOOK AHEAD",
//       text: "Whenever one of your other Sapphire characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
//       optional: true,
//       characterFilter: [
//         { filter: "owner", value: "self" },
//         { filter: "type", value: "character" },
//         { filter: "zone", value: "play" },
//         { filter: "color", value: "sapphire" },
//         { filter: "source", value: "other" },
//       ],
//       effects: [
//         {
//           type: "scry",
//           amount: 1,
//           mode: "both",
//           limits: {
//             top: 1,
//             bottom: 1,
//           },
//           target: self,
//         },
//       ],
//     }),
//   ],
// };
//
