import type { CharacterCard } from "@tcg/lorcana-types";

export const starkeyHooksHenchman: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "187-1",
      name: "AYE AYE, CAPTAIN",
      text: "AYE AYE, CAPTAIN While you have a Captain character in play, this character gets +1 {L}.",
      type: "static",
    },
  ],
  cardNumber: 191,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Pirate"],
  cost: 5,
  externalIds: {
    ravensburger: "9f1a143825dcb63a6c7b8c8ce3c50df1302b8c9c",
  },
  franchise: "Peter Pan",
  fullName: "Starkey - Hook’s Henchman",
  id: "187",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  name: "Starkey",
  set: "001",
  strength: 5,
  text: "AYE AYE, CAPTAIN While you have a Captain character in play, this character gets +1 {L}.",
  version: "Hook’s Henchman",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { haveCaptainInPlay } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// Import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const starkeyHooksHenchman: LorcanitoCharacterCard = {
//   Id: "wxx",
//
//   Name: "Starkey",
//   Title: "Hook's Henchman",
//   Characteristics: ["storyborn", "pirate", "ally"],
//   Text: "**AYE AYE, CAPTAIN** While you have a Captain character in play, this character gets +1 {L}.",
//   Type: "character",
//   Abilities: [
//     WhileConditionThisCharacterGets({
//       Name: "Ay Aye, Captain",
//       Text: "While you have a Captain character in play, this character gets +1 {L}.",
//       Conditions: [haveCaptainInPlay],
//       Attribute: "lore",
//       Amount: 1,
//     }),
//   ],
//   Flavour:
//     "A pirate must be tough, loyal, and strong. Smart doesn't even make the list.",
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 5,
//   Strength: 5,
//   Willpower: 4,
//   Lore: 1,
//   Illustrator: "Leonardo Giammichele",
//   Number: 191,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508947,
//   },
//   Rarity: "uncommon",
// };
//
