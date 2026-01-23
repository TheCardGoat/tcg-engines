// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { yourCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenChallenged } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { targetCardsGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import { putTopCardOfYourDeckIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const jeweledCollar: LorcanitoItemCard = {
//   id: "xhq",
//   name: "Jeweled Collar",
//   characteristics: ["item"],
//   text: "WELCOME EXTRAVAGANCE Whenever one of your characters is challenged, you may put the top card of your deck into your inkwell facedown and exerted.",
//   type: "item",
//   inkwell: true,
//   colors: ["emerald", "sapphire"],
//   cost: 2,
//   illustrator: "Filipe Laurentino",
//   number: 120,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631764,
//   },
//   rarity: "uncommon",
//   abilities: [
//     targetCardsGains({
//       name: "WELCOME EXTRAVAGANCE",
//       text: "Whenever one of your characters is challenged, you may put the top card of your deck into your inkwell facedown and exerted.",
//       target: yourCharacters,
//       ability: whenChallenged({
//         name: "WELCOME EXTRAVAGANCE",
//         text: "Whenever one of your characters is challenged, you may put the top card of your deck into your inkwell facedown and exerted.",
//         optional: true,
//         effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
//       }),
//     }),
//   ],
// };
//
