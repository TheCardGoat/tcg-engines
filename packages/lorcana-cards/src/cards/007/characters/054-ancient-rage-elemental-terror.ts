// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   type GainAbilityStaticAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import {
//   opposingCharacters,
//   thisCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverIsExerted } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { banishThisCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// const ancientRage: GainAbilityStaticAbility = {
//   type: "static",
//   ability: "gain-ability",
//   name: "ANCIENT RAGE",
//   text: "During your turn, whenever an opposing character is exerted, banish them.",
//   conditions: [{ type: "during-turn", value: "self" }],
//   target: opposingCharacters,
//   gainedAbility: wheneverIsExerted({
//     name: "ANCIENT RAGE",
//     text: "During your turn, whenever an opposing character is exerted, banish them.",
//     target: thisCharacter,
//     effects: [banishThisCharacter],
//   }),
// };
// export const teKaElementalTerror: LorcanitoCharacterCard = {
//   id: "g0z",
//   name: "Te Kā",
//   title: "Elemental Terror",
//   characteristics: ["floodborn", "villain", "deity"],
//   text: "Shift 7\nANCIENT RAGE During your turn, whenever an opposing character is exerted, banish them.",
//   type: "character",
//   abilities: [shiftAbility(7, "Te Kā"), ancientRage],
//   inkwell: true,
//
//   colors: ["amethyst", "ruby"],
//   cost: 10,
//   strength: 12,
//   willpower: 12,
//   illustrator: "Nicola Savioli",
//   number: 54,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618257,
//   },
//   rarity: "super_rare",
//   lore: 3,
// };
//
