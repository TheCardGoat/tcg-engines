import type { CharacterCard } from "@tcg/lorcana-types";

export const davidXanatosSteelClanLeader: CharacterCard = {
  id: "xa7",
  cardType: "character",
  name: "David Xanatos",
  version: "Steel Clan Leader",
  fullName: "David Xanatos - Steel Clan Leader",
  inkType: ["steel"],
  franchise: "Gargoyles",
  set: "010",
  text: "MINOR INCONVENIENCE When you play this character, you may choose and discard a card to deal 2 damage to chosen character.",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 184,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "77f48553077c039331c07d2db0a31696cdd3c13f",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const davidXanatosSteelClanLeader: LorcanitoCharacterCard = {
//   id: "eog",
//   name: "David Xanatos",
//   title: "Steel Clan Leader",
//   characteristics: ["storyborn", "villain"],
//   text: "MINOR INCONVENIENCE When you play this character, you may choose and discard a card to deal 2 damage to chosen character.",
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 3,
//   willpower: 2,
//   illustrator: "Renato Roldan / Amanda Duarte",
//   number: 184,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658502,
//   },
//   rarity: "uncommon",
//   abilities: [
//     whenYouPlayThis({
//       optional: true,
//       name: "MINOR INCONVENIENCE",
//       text: "When you play this character, you may choose and discard a card to deal 2 damage to chosen character.",
//       effects: [
//         {
//           type: "discard",
//           amount: 1,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               {
//                 filter: "zone",
//                 value: "hand",
//               },
//               {
//                 filter: "owner",
//                 value: "self",
//               },
//             ],
//           },
//         },
//         {
//           type: "damage",
//           amount: 2,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               {
//                 filter: "type",
//                 value: "character",
//               },
//               {
//                 filter: "zone",
//                 value: "play",
//               },
//             ],
//           },
//         },
//       ],
//       resolveEffectsIndividually: true,
//       dependentEffects: true,
//     }),
//   ],
//   lore: 1,
// };
//
