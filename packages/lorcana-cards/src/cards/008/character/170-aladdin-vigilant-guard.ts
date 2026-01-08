// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const aladdinVigilantGuard: LorcanitoCharacterCard = {
//   id: "fg9",
//   name: "Aladdin",
//   title: "Vigilant Guard",
//   characteristics: ["dreamborn", "hero", "prince"],
//   text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSAFE PASSAGE Whenever one of your Ally characters quests, you may remove up to 2 damage from this character.",
//   type: "character",
//   abilities: [
//     bodyguardAbility,
//     wheneverQuests({
//       name: "SAFE PASSAGE",
//       text: "Whenever one of your Ally characters quests, you may remove up to 2 damage from this character.",
//       optional: true,
//       triggerTarget: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "type", value: "character" },
//           { filter: "characteristics", value: ["ally"] },
//           { filter: "owner", value: "self" },
//           { filter: "zone", value: "play" },
//         ],
//       },
//       effects: [
//         {
//           type: "heal",
//           amount: 2,
//           upTo: true,
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire", "steel"],
//   cost: 6,
//   strength: 1,
//   willpower: 9,
//   illustrator: "Marcel Berg",
//   number: 170,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631466,
//   },
//   rarity: "rare",
//   lore: 1,
// };
//
