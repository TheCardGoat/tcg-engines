import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseGhostHunter: CharacterCard = {
  id: "oy7",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Ghost Hunter",
  fullName: "Minnie Mouse - Ghost Hunter",
  inkType: ["steel"],
  set: "010",
  text: "SEARCH THE SHADOWS When you play this character, chosen Detective character gains Alert this turn. (They can challenge as if they had Evasive.)",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 181,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "59ec24f8abd468cdaaccf255cd749d7799c79be5",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const minnieMouseGhostHunter: LorcanitoCharacterCard = {
//   id: "af5",
//   name: "Minnie Mouse",
//   title: "Ghost Hunter",
//   characteristics: ["dreamborn", "hero", "detective"],
//   text: "SEARCH THE SHADOWS When you play this character, chosen Detective character gains Alert this turn. (They can challenge as if they had Evasive.)",
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   strength: 2,
//   willpower: 3,
//   illustrator: "Brianna Garcia",
//   number: 181,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658751,
//   },
//   rarity: "common",
//   abilities: [
//     whenYouPlayThis({
//       name: "SEARCH THE SHADOWS",
//       text: "When you play this character, chosen Detective character gains Alert this turn.",
//       effects: [
//         {
//           type: "ability",
//           ability: "alert",
//           modifier: "add",
//           duration: "turn",
//           until: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//               { filter: "characteristics", value: ["detective"] },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   lore: 1,
// };
//
