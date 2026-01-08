// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { exertChosenOpposingCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// const iceOver: ActivatedAbility = {
//   type: "activated",
//   name: "ICE OVER",
//   text: "1 {I}, Choose and discard a card – Exert chosen opposing character.",
//   optional: false,
//   costs: [
//     { type: "ink", amount: 1 },
//     {
//       type: "card",
//       action: "discard",
//       amount: 1,
//       filters: [
//         { filter: "zone", value: "hand" },
//         { filter: "owner", value: "self" },
//       ],
//     },
//   ],
//   effects: [exertChosenOpposingCharacter],
// };
//
// export const elsaFierceProtector: LorcanitoCharacterCard = {
//   id: "wd1",
//   name: "Elsa",
//   title: "Fierce Protector",
//   characteristics: ["storyborn", "hero", "queen", "sorcerer"],
//   text: "ICE OVER 1 {I}, Choose and discard a card – Exert chosen opposing character.",
//   type: "character",
//   abilities: [iceOver],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   illustrator: "Hedvig H S",
//   number: 60,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631391,
//   },
//   rarity: "rare",
//   lore: 1,
// };
//
