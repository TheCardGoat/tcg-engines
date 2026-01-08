// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   evasiveAbility,
//   rushAbility,
//   yourOtherCharactersWithGain,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const peterPansShadowNotSewnOn: LorcanitoCharacterCard = {
//   id: "si7",
//   reprints: ["bt3"],
//
//   name: "Peter Pan's Shadow",
//   title: "Not Sewn On",
//   characteristics: ["storyborn", "ally"],
//   text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**Rush** _(This character can challenge the turn they're played.)_\n\n**TIPTOE** Your other characters with **Rush** gain **Evasive**.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     rushAbility,
//     yourOtherCharactersWithGain({
//       name: "Tip Toe",
//       text: "Your other characters with **Rush** gain **Evasive**.",
//       gainedAbility: evasiveAbility,
//       filter: { filter: "ability", value: "rush" },
//     }),
//   ],
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 2,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Giulia Riva",
//   number: 55,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527309,
//   },
//   rarity: "super_rare",
// };
//
