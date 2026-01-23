// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenPlayOnThisCard } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { putTopCardOfYourDeckIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const goGoTomagoMechanicalEngineer: LorcanitoCharacterCard = {
//   id: "p29",
//   name: "Go Go Tomago",
//   title: "Mechanical Engineer",
//   characteristics: ["storyborn", "hero", "inventor"],
//   text: "NEED THIS! When you play a Floodborn character on this card, you may put the top card of your deck into your inkwell facedown and exerted.",
//   type: "character",
//   abilities: [
//     whenPlayOnThisCard({
//       name: "NEED THIS!",
//       text: "When you play a Floodborn character on this card, you may put the top card of your deck into your inkwell facedown and exerted.",
//       optional: true,
//       effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
//       shiftedTargetFilters: [{ filter: "source", value: "self" }],
//       shifterTargetFilters: [
//         { filter: "characteristics", value: ["floodborn"] },
//         { filter: "owner", value: "self" },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 1,
//   willpower: 3,
//   illustrator: "Jennifer Wu",
//   number: 159,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631691,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
