// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import {
//   chosenCharacterOfYoursIncludingSelf,
//   chosenOtherCharacterOfYours,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import { moveToLocation } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const tukTukLivelyPartner: LorcanitoCharacterCard = {
//   id: "fjt",
//   reprints: ["lts"],
//   name: "Tuk Tuk",
//   title: "Lively Partner",
//   characteristics: ["ally"],
//   text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n\n**ON A ROLL** When you play this character, you may move him and one of your other characters to the same location for free. The other character gets +2 {S} this turn.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     {
//       type: "resolution",
//       name: "ON A ROLL",
//       text: "When you play this character, you may move him and one of your other characters to the same location for free. The other character gets +2 {S} this turn.",
//       optional: true,
//       dependentEffects: true,
//       effects: [
//         moveToLocation(chosenCharacterOfYoursIncludingSelf),
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "add",
//           duration: "turn",
//           target: chosenOtherCharacterOfYours,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Sandra Rios",
//   number: 127,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549619,
//   },
//   rarity: "rare",
// };
//
