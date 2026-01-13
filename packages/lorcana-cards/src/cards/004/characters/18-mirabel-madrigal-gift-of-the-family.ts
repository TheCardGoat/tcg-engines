// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const mirabelMadrigalGiftOfTheFamily: LorcanitoCharacterCard = {
//   id: "o01",
//   missingTestCase: true,
//   name: "Mirabel Madrigal",
//   title: "Gift of the Family",
//   characteristics: ["hero", "dreamborn", "madrigal"],
//   text: "**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_\n\n**SAVING THE MIRACLE** Whenever this character quests, your other Madrigal characters get +1 {L} this turn.",
//   type: "character",
//   abilities: [
//     supportAbility,
//     wheneverQuests({
//       name: "Saving The Miracle",
//       text: "Whenever this character quests, your other Madrigal characters get +1 {L} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: 1,
//           modifier: "add",
//           duration: "turn",
//           target: {
//             type: "card",
//             value: "all",
//             excludeSelf: true,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "characteristics", value: ["madrigal"] },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   colors: ["amber"],
//   cost: 5,
//   strength: 3,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Aubrey Archer",
//   number: 18,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 543898,
//   },
//   rarity: "super_rare",
// };
//
