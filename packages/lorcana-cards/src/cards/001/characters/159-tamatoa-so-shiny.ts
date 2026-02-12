import type { CharacterCard } from "@tcg/lorcana-types";

export const tamatoaSoShiny: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "return-from-discard",
          cardType: "item",
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      id: "sj3-1",
      name: "WHAT HAVE WE HERE?",
      text: "WHAT HAVE WE HERE? When you play this character and whenever he quests, you may return an item card from your discard to your hand.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: { type: "items-in-play", controller: "you" },
        target: "SELF",
      },
      id: "sj3-2",
      name: "GLAM",
      text: "GLAM This character gets +1 {L} for each item you have in play.",
      type: "static",
    },
  ],
  cardNumber: 159,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 8,
  externalIds: {
    ravensburger: "66d3b6106914373f1b4612e524cff18f5144a3a1",
  },
  franchise: "Moana",
  fullName: "Tamatoa - So Shiny!",
  id: "sj3",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  name: "Tamatoa",
  set: "001",
  strength: 5,
  text: "WHAT HAVE WE HERE? When you play this character and whenever he quests, you may return an item card from your discard to your hand.\nGLAM This character gets +1 {L} for each item you have in play.",
  version: "So Shiny!",
  willpower: 8,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { whenPlayAndWheneverQuests } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Import { propertyStaticAbilities } from "../../../abilities/propertyStaticAbilities"; // Add import
//
// Export const tamatoaSoShiny: LorcanitoCharacterCard = {
//   Id: "jzt",
//   Name: "Tamatoa",
//   Title: "So Shiny!",
//   Characteristics: ["storyborn", "villain"],
//   Text: "**WHAT HAVE WE HERE?** When you play this character and whenever he quests, you may return an item card from your discard to your hand.\n\n**GLAM** This character gets +1 {L} for each item you have in play.",
//   Type: "character",
//   Abilities: [
//     PropertyStaticAbilities({
//       Name: "Glam",
//       Text: "This character gets +1 {L} for each item you have in play.",
//       Attribute: "lore",
//       Amount: {
//         Dynamic: true,
//         Filters: [
//           { filter: "zone", value: "play" },
//           { filter: "type", value: "item" },
//           { filter: "owner", value: "self" },
//         ],
//       },
//     }),
//     ...whenPlayAndWheneverQuests({
//       Name: "What have we here?",
//       Text: "When you play this character and whenever he quests, you may return an item card from your discard to your hand.",
//       Optional: true,
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "item" },
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "discard" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Flavour: "Watch me dazzle like a diamond in the rough!",
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 8,
//   Strength: 5,
//   Willpower: 8,
//   Lore: 1,
//   Illustrator: "Leonardo Giammichele",
//   Number: 159,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508881,
//   },
//   Rarity: "super_rare",
// };
//
