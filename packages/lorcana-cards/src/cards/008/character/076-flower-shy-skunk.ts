// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// import { wheneverTargetPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// import { lookAtTopCardOfYourDeckAndPutItOnTopOrBottom } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const flowerShySkunk: LorcanitoCharacterCard = {
//   id: "mka",
//   name: "Flower",
//   title: "Shy Skunk",
//   characteristics: ["storyborn", "ally"],
//   text: "LOOKING FOR FRIENDS Whenever you play another character, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Sandro Rios",
//   number: 76,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631342,
//   },
//   rarity: "rare",
//   lore: 1,
//   abilities: [
//     wheneverTargetPlays({
//       name: "LOOKING FOR FRIENDS",
//       text: "Whenever you play another character, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
//       optional: true,
//       excludeSelf: true,
//       triggerFilter: [
//         { filter: "type", value: "character" },
//         { filter: "owner", value: "self" },
//       ],
//       effects: [lookAtTopCardOfYourDeckAndPutItOnTopOrBottom],
//     }),
//   ],
// };
//
