// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { moveDamageAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import {
//   chosenCharacter,
//   chosenOpposingCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const mamaOdieVoiceOfWisdom: LorcanitoCharacterCard = {
//   id: "l0k",
//   reprints: ["ozw"],
//   missingTestCase: true,
//   name: "Mama Odie",
//   title: "Voice of Wisdom",
//   characteristics: ["dreamborn", "sorcerer", "ally"],
//   text: "**LISTEN TO YOUR MAMA NOW** Whenever this character quests, you may move up to 2 damage counters from chosen character to chosen opposing character.",
//   abilities: [
//     wheneverQuests({
//       name: "LISTEN TO YOUR MAMA NOW",
//       text: "Whenever this character quests, you may move up to 2 damage counters from chosen character to chosen opposing character.",
//       ...moveDamageAbility({
//         amount: 2,
//         from: chosenCharacter,
//         to: chosenOpposingCharacter,
//       }),
//     }),
//   ],
//   type: "character",
//   flavour: "That's the way to give it what it needs, Juju!",
//   colors: ["amethyst"],
//   cost: 6,
//   strength: 3,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Cristian Romero",
//   number: 52,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 531827,
//   },
//   rarity: "uncommon",
// };
//
