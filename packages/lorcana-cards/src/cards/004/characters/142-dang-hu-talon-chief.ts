import type { CharacterCard } from "@tcg/lorcana-types";

export const dangHuTalonChief: CharacterCard = {
  id: "tq9",
  cardType: "character",
  name: "Dang Hu",
  version: "Talon Chief",
  fullName: "Dang Hu - Talon Chief",
  inkType: ["sapphire"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  text: "YOU BETTER TALK FAST Your other Villain characters gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 142,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6b256ace2b9933072bfb17c69e330f90bc90ae8e",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   GainAbilityStaticAbility,
//   LorcanitoCharacterCard,
// } from "@lorcanito/lorcana-engine";
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const dangHuTalonChief: LorcanitoCharacterCard = {
//   id: "ave",
//   missingTestCase: true,
//   name: "Dang Hu",
//   title: "Talon Chief",
//   characteristics: ["storyborn", "villain"],
//   text: "**YOU BETTER TALK FAST** Your other Villain characters gain **Support.** _(Whenever they quest, you mad add their {S} to another chosen character's {S} this turn.)_",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "YOU BETTER TALK FAST",
//       text: "Your other Villain characters gain **Support.** _(Whenever they quest, you mad add their {S} to another chosen character's {S} this turn.)_",
//       gainedAbility: supportAbility,
//       target: {
//         type: "card",
//         value: "all",
//         excludeSelf: true,
//         filters: [
//           { filter: "owner", value: "self" },
//           { filter: "type", value: "character" },
//           { filter: "characteristics", value: "villain" },
//           { filter: "zone", value: "play" },
//         ],
//       },
//     } as GainAbilityStaticAbility,
//   ],
//   flavour: "You can find villainy in the most unexpected places.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 5,
//   strength: 3,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Rudy Hill",
//   number: 142,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549247,
//   },
//   rarity: "rare",
// };
//
