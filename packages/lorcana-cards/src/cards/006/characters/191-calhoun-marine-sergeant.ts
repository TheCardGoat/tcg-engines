import type { CharacterCard } from "@tcg/lorcana-types";

export const calhounMarineSergeant: CharacterCard = {
  id: "10g",
  cardType: "character",
  name: "Calhoun",
  version: "Marine Sergeant",
  fullName: "Calhoun - Marine Sergeant",
  inkType: ["steel"],
  franchise: "Wreck It Ralph",
  set: "006",
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)\nLEVEL UP During your turn, whenever this character banishes another character in a challenge, gain 2 lore.",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 191,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8364649fe1abbe5e1521f9dca01ac72dbac4ff28",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { resistAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverBanishesAnotherCharacterInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const calhounMarineSergeant: LorcanitoCharacterCard = {
//   id: "tju",
//   name: "Calhoun",
//   title: "Marine Sergeant",
//   characteristics: ["storyborn", "hero"],
//   text: "Resist +1 (Damage dealt to this character is reduced by 1.)\n\n**LEVEL UP** During your turn, whenever this character banishes another character in a challenge, gain 2 lore.",
//   type: "character",
//   abilities: [
//     resistAbility(1),
//     wheneverBanishesAnotherCharacterInChallenge({
//       name: "LEVEL UP",
//       text: "During your turn, whenever this character banishes another character in a challenge, gain 2 lore.",
//       effects: [
//         {
//           type: "lore",
//           amount: 2,
//           modifier: "add",
//           target: self,
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["steel"],
//   cost: 2,
//   strength: 3,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Kevin Sidharta",
//   number: 191,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 592017,
//   },
//   rarity: "rare",
// };
//
