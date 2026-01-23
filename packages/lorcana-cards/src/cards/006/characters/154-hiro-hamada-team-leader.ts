import type { CharacterCard } from "@tcg/lorcana-types";

export const hiroHamadaTeamLeader: CharacterCard = {
  id: "1yr",
  cardType: "character",
  name: "Hiro Hamada",
  version: "Team Leader",
  fullName: "Hiro Hamada - Team Leader",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "I NEED TO UPGRADE ALL OF YOU Your other Inventor characters gain Resist +1. (Damage dealt to them is reduced by 1.)\n\nSHAPE THE FUTURE 2 {I} - Look at the top card of your deck. Put it on either the top or the bottom of your deck.",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 1,
  cardNumber: 154,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ff11309d766c3ab5b5c66c8ce13f398571351161",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Inventor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { resistAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { lookAtTopCardOfYourDeckAndPutItOnTopOrBottom } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const hiroHamadaTeamLeader: LorcanitoCharacterCard = {
//   id: "oef",
//   name: "Hiro Hamada",
//   title: "Team Leader",
//   characteristics: ["hero", "storyborn", "inventor"],
//   text: "**I NEED TO UPGRADE ALL OF YOU** Your other Inventor characters gain **Resist** +1. _(Damage dealt to them is reduced by 1.)_\n\n**SHAPE THE FUTURE** 2 {I} − Look at the top card of your deck. Put it on either the top or the bottom of your deck.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "I NEED TO UPGRADE ALL OF YOU",
//       text: "Your other Inventor characters gain **Resist** +1. _(Damage dealt to them is reduced by 1.)",
//       gainedAbility: resistAbility(1),
//       target: {
//         type: "card",
//         value: "all",
//         excludeSelf: true,
//         filters: [
//           { filter: "zone", value: "play" },
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "self" },
//           { filter: "characteristics", value: ["inventor"] },
//         ],
//       },
//     },
//     {
//       type: "activated",
//       costs: [{ type: "ink", amount: 2 }],
//       name: "SHAPE THE FUTURE",
//       text: "Look at the top card of your deck. Put it on either the top or the bottom of your deck.",
//       effects: [lookAtTopCardOfYourDeckAndPutItOnTopOrBottom],
//     },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 1,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Gonzalo Kenny",
//   number: 154,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 578232,
//   },
//   rarity: "rare",
// };
//
