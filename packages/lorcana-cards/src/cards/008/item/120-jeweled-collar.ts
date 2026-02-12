// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// Import { yourCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenChallenged } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { targetCardsGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// Import { putTopCardOfYourDeckIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const jeweledCollar: LorcanitoItemCard = {
//   Id: "xhq",
//   Name: "Jeweled Collar",
//   Characteristics: ["item"],
//   Text: "WELCOME EXTRAVAGANCE Whenever one of your characters is challenged, you may put the top card of your deck into your inkwell facedown and exerted.",
//   Type: "item",
//   Inkwell: true,
//   Colors: ["emerald", "sapphire"],
//   Cost: 2,
//   Illustrator: "Filipe Laurentino",
//   Number: 120,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631764,
//   },
//   Rarity: "uncommon",
//   Abilities: [
//     TargetCardsGains({
//       Name: "WELCOME EXTRAVAGANCE",
//       Text: "Whenever one of your characters is challenged, you may put the top card of your deck into your inkwell facedown and exerted.",
//       Target: yourCharacters,
//       Ability: whenChallenged({
//         Name: "WELCOME EXTRAVAGANCE",
//         Text: "Whenever one of your characters is challenged, you may put the top card of your deck into your inkwell facedown and exerted.",
//         Optional: true,
//         Effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
//       }),
//     }),
//   ],
// };
//
