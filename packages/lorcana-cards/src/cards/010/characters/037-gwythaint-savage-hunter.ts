import type { CharacterCard } from "@tcg/lorcana-types";

export const gwythaintSavageHunter: CharacterCard = {
  id: "grx",
  cardType: "character",
  name: "Gwythaint",
  version: "Savage Hunter",
  fullName: "Gwythaint - Savage Hunter",
  inkType: ["amethyst"],
  franchise: "Black Cauldron",
  set: "010",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSWOOPING STRIKE Whenever this character quests, each opponent chooses and exerts one of their ready characters.",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 2,
  cardNumber: 37,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3c7620143a9295e9596253819d51cf19b637c0a5",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Dragon"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const gwythaintSavageHunter: LorcanitoCharacterCard = {
//   id: "eio",
//   name: "Gwythaint",
//   title: "Savage Hunter",
//   characteristics: ["storyborn", "ally", "dragon"],
//   text: "Evasive (Only characters with Evasive can challenge this character.)\nSWOOPING STRIKE Whenever this character quests, each opponent chooses and exerts one of their ready characters.",
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 4,
//   willpower: 3,
//   illustrator: "João Moura",
//   number: 37,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658292,
//   },
//   rarity: "uncommon",
//   abilities: [
//     evasiveAbility,
//     wheneverThisCharacterQuests({
//       name: "SWOOPING STRIKE",
//       text: "Whenever this character quests, each opponent chooses and exerts one of their ready characters.",
//       responder: "opponent",
//       effects: [
//         {
//           type: "exert",
//           exert: true,
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
//               {
//                 filter: "owner",
//                 value: "self",
//               },
//               {
//                 filter: "status",
//                 value: "ready",
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   lore: 2,
// };
//
