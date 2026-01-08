// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { opponent, self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const gloydOrangeboarFierceCompetitor: LorcanitoCharacterCard = {
//   id: "imz",
//   name: "Gloyd Orangeboar",
//   title: "Fierce Competitor",
//   characteristics: ["storyborn", "ally", "racer"],
//   text: "PUMPKIN SPICE When you play this character, each opponent loses 1 lore and you gain 1 lore.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "PUMPKIN SPICE",
//       text: "When you play this character, each opponent loses 1 lore and you gain 1 lore.",
//       effects: [
//         {
//           type: "lore",
//           modifier: "subtract",
//           amount: 1,
//           target: opponent,
//         },
//         {
//           type: "lore",
//           modifier: "add",
//           amount: 1,
//           target: self,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 1,
//   willpower: 2,
//   illustrator: "Rudy Hill // Denny Minonne",
//   number: 121,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631705,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
