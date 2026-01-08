// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const fergusMcduckScroogesFather: LorcanitoCharacterCard = {
//   id: "pkp",
//   name: "Fergus McDuck",
//   title: "Scrooge's Father",
//   characteristics: ["storyborn", "mentor"],
//   text: "TOUGHEN UP When you play this character, chosen character of yours gains Ward until the start of your next turn. (Opponents can't choose them except to challenge.)",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "TOUGHEN UP",
//       text: "When you play this character, chosen character of yours gains Ward until the start of your next turn. (Opponents can't choose them except to challenge.)",
//       effects: [
//         {
//           type: "ability",
//           ability: "ward",
//           duration: "next_turn",
//           until: true,
//           modifier: "add",
//           target: chosenCharacterOfYours,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 3,
//   willpower: 2,
//   illustrator: "Kenneth Anderson",
//   number: 144,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659601,
//   },
//   rarity: "common",
//   lore: 2,
// };
//
