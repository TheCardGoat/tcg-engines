import type { CharacterCard } from "@tcg/lorcana-types";

export const tamatoaSoShiny: CharacterCard = {
  id: "sj3",
  cardType: "character",
  name: "Tamatoa",
  version: "So Shiny!",
  fullName: "Tamatoa - So Shiny!",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "001",
  text: "WHAT HAVE WE HERE? When you play this character and whenever he quests, you may return an item card from your discard to your hand.\nGLAM This character gets +1 {L} for each item you have in play.",
  cost: 8,
  strength: 5,
  willpower: 8,
  lore: 1,
  cardNumber: 159,
  inkable: true,
  externalIds: {
    ravensburger: "66d3b6106914373f1b4612e524cff18f5144a3a1",
  },
  abilities: [
    {
      id: "sj3-1",
      text: "WHAT HAVE WE HERE? When you play this character and whenever he quests, you may return an item card from your discard to your hand.",
      name: "WHAT HAVE WE HERE?",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-from-discard",
          cardType: "item",
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
    {
      id: "sj3-2",
      text: "GLAM This character gets +1 {L} for each item you have in play.",
      name: "GLAM",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: { type: "items-in-play", controller: "you" },
        target: "SELF",
      },
    },
  ],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenPlayAndWheneverQuests } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// import { propertyStaticAbilities } from "../../../abilities/propertyStaticAbilities"; // Add import
//
// export const tamatoaSoShiny: LorcanitoCharacterCard = {
//   id: "jzt",
//   name: "Tamatoa",
//   title: "So Shiny!",
//   characteristics: ["storyborn", "villain"],
//   text: "**WHAT HAVE WE HERE?** When you play this character and whenever he quests, you may return an item card from your discard to your hand.\n\n**GLAM** This character gets +1 {L} for each item you have in play.",
//   type: "character",
//   abilities: [
//     propertyStaticAbilities({
//       name: "Glam",
//       text: "This character gets +1 {L} for each item you have in play.",
//       attribute: "lore",
//       amount: {
//         dynamic: true,
//         filters: [
//           { filter: "zone", value: "play" },
//           { filter: "type", value: "item" },
//           { filter: "owner", value: "self" },
//         ],
//       },
//     }),
//     ...whenPlayAndWheneverQuests({
//       name: "What have we here?",
//       text: "When you play this character and whenever he quests, you may return an item card from your discard to your hand.",
//       optional: true,
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "item" },
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "discard" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: "Watch me dazzle like a diamond in the rough!",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 8,
//   strength: 5,
//   willpower: 8,
//   lore: 1,
//   illustrator: "Leonardo Giammichele",
//   number: 159,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508881,
//   },
//   rarity: "super_rare",
// };
//
