import type { CharacterCard } from "@tcg/lorcana-types";

export const belleStrangeButSpecial: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          modifier: 4,
          stat: "lore",
          target: "SELF",
          type: "modify-stat",
        },
        type: "optional",
      },
      id: "uxx-1",
      text: "**READ A BOOK** During your turn, you may put an additional card from your hand into your inkwell facedown.\n\n**MY FAVOURITE PART!** While you have 10 or more cards in your inkwell, this character gets +4 {L}.",
      type: "action",
    },
  ],
  cardNumber: 142,
  cardType: "character",
  classifications: ["Hero", "Storyborn", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Belle - Strange but Special",
  id: "uxx",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  name: "Belle",
  set: "001",
  strength: 2,
  text: "**READ A BOOK** During your turn, you may put an additional card from your hand into your inkwell facedown.\n\n**MY FAVOURITE PART!** While you have 10 or more cards in your inkwell, this character gets +4 {L}.",
  version: "Strange but Special",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const belleStrangeButBeautiful: LorcanitoCharacterCard = {
//   Id: "uxx",
//   Name: "Belle",
//   Title: "Strange but Special",
//   Characteristics: ["hero", "storyborn", "princess"],
//   Text: "**READ A BOOK** During your turn, you may put an additional card from your hand into your inkwell facedown.\n\n**MY FAVOURITE PART!** While you have 10 or more cards in your inkwell, this character gets +4 {L}.",
//   Type: "character",
//   Abilities: [
//     // {
//     //   type: "static",
//     //   name: "Read a Book",
//     //   text: "During your turn, you may put an additional card from your hand into your inkwell facedown.",
//     //   // TODO: Sorry but I was too lazy to properly implement this
//     //   // TableModel is querying how many Belles we have in place
//     // },
//     WhileConditionThisCharacterGets({
//       Name: "My Favourite Part!",
//       Text: "While you have 10 or more cards in your inkwell, this character gets +4 {L}.",
//       Conditions: [
//         {
//           Type: "inkwell",
//           Amount: 10,
//         },
//       ],
//       Attribute: "lore",
//       Amount: 4,
//     }),
//   ],
//   Flavour:
//     "Far-off places, daring sword fights, magic spells, a prince in disguise . . .",
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 4,
//   Strength: 2,
//   Willpower: 4,
//   Lore: 1,
//   Illustrator: "Alice Pisoni",
//   Number: 142,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508816,
//   },
//   Rarity: "legendary",
// };
//
