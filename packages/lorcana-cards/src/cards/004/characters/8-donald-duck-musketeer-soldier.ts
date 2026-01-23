// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const donaldDuckMusketeerSoldier: LorcanitoCharacterCard = {
//   id: "xjt",
//   name: "Donald Duck",
//   title: "Musketeer Soldier",
//   characteristics: ["hero", "dreamborn", "musketeer"],
//   text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_\n\n\n**WAIT FOR ME!** When you play this character, chosen character gets +1 {L} this turn.",
//   type: "character",
//   abilities: [
//     bodyguardAbility,
//     {
//       type: "resolution",
//       name: "WAIT FOR ME!",
//       text: "When you play this character, chosen character gets +1 {L} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: 1,
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Jochem van Gool",
//   number: 8,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550556,
//   },
//   rarity: "uncommon",
// };
//
