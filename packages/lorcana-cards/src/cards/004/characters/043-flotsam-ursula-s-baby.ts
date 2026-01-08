// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenThisCharacterBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { returnThisCardToHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const flotsamUrsulasBaby: LorcanitoCharacterCard = {
//   id: "ha8",
//   missingTestCase: true,
//   name: "Flotsam",
//   title: 'Ursula\'s "Baby"',
//   characteristics: ["dreamborn", "ally"],
//   text: '**QUICK ESCAPE** When this character is banished in a challenge, return this card to your hand.\n\n\n**OMINOUS PAIR** Your characters named Jetsam gain "When this character is banished in a challenge, return this card to your hand."',
//   type: "character",
//   abilities: [
//     whenThisCharacterBanishedInAChallenge({
//       name: "Quick Escape",
//       text: "When this character is banished in a challenge, return this card to your hand.",
//       effects: [returnThisCardToHand],
//     }),
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "Quick Escape",
//       text: "When this character is banished in a challenge, return this card to your hand.",
//       gainedAbility: whenThisCharacterBanishedInAChallenge({
//         name: "Quick Escape",
//         text: "When this character is banished in a challenge, return this card to your hand.",
//         effects: [returnThisCardToHand],
//       }),
//       target: {
//         type: "card",
//         value: "all",
//         excludeSelf: true,
//         filters: [
//           { filter: "owner", value: "self" },
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           {
//             filter: "attribute",
//             value: "name",
//             comparison: { operator: "eq", value: "Jetsam" },
//           },
//         ],
//       },
//     },
//   ],
//   flavour: "Now the crown <b>and</b> the trident are mine! −Ursula",
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 4,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Brian Kesinger",
//   number: 43,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549467,
//   },
//   rarity: "uncommon",
// };
//
