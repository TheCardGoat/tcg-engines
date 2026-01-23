import type { CharacterCard } from "@tcg/lorcana-types";

export const basilSecretInformer: CharacterCard = {
  id: "lk0",
  cardType: "character",
  name: "Basil",
  version: "Secret Informer",
  fullName: "Basil - Secret Informer",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "007",
  text: "DRAW THEM OUT Whenever this character quests, opposing damaged characters gain Reckless during their next turn. (They can't quest and must challenge if able.)",
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 3,
  cardNumber: 93,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4db0a324dcb5d1ff69156dfa4c107253863062c3",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { eachOpposingDamagedCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const basilSecretInformer: LorcanitoCharacterCard = {
//   id: "zkd",
//   name: "Basil",
//   title: "Secret Informer",
//   characteristics: ["dreamborn", "hero", "detective"],
//   text: "DRAW THEM OUT Whenever this character quests, opposing damaged characters gain Reckless during their next turn. (They can't quest and must challenge if able.)",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "DRAW THEM OUT",
//       text: "Whenever this character quests, opposing damaged characters gain Reckless during their next turn. (They can't quest and must challenge if able.)",
//       effects: [
//         {
//           type: "ability",
//           ability: "reckless",
//           modifier: "add",
//           duration: "next_turn",
//           target: eachOpposingDamagedCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 6,
//   strength: 3,
//   willpower: 6,
//   illustrator: "Valerio Buonfantino",
//   number: 93,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619456,
//   },
//   rarity: "rare",
//   lore: 3,
// };
//
