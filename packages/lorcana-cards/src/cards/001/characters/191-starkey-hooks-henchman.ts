import type { CharacterCard } from "@tcg/lorcana-types";

export const starkeyHooksHenchman: CharacterCard = {
  id: "187",
  cardType: "character",
  name: "Starkey",
  version: "Hook’s Henchman",
  fullName: "Starkey - Hook’s Henchman",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "001",
  text: "AYE AYE, CAPTAIN While you have a Captain character in play, this character gets +1 {L}.",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 1,
  cardNumber: 191,
  inkable: true,
  externalIds: {
    ravensburger: "9f1a143825dcb63a6c7b8c8ce3c50df1302b8c9c",
  },
  abilities: [
    {
      id: "187-1",
      text: "AYE AYE, CAPTAIN While you have a Captain character in play, this character gets +1 {L}.",
      name: "AYE AYE, CAPTAIN",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
    },
  ],
  classifications: ["Storyborn", "Ally", "Pirate"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { haveCaptainInPlay } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const starkeyHooksHenchman: LorcanitoCharacterCard = {
//   id: "wxx",
//
//   name: "Starkey",
//   title: "Hook's Henchman",
//   characteristics: ["storyborn", "pirate", "ally"],
//   text: "**AYE AYE, CAPTAIN** While you have a Captain character in play, this character gets +1 {L}.",
//   type: "character",
//   abilities: [
//     whileConditionThisCharacterGets({
//       name: "Ay Aye, Captain",
//       text: "While you have a Captain character in play, this character gets +1 {L}.",
//       conditions: [haveCaptainInPlay],
//       attribute: "lore",
//       amount: 1,
//     }),
//   ],
//   flavour:
//     "A pirate must be tough, loyal, and strong. Smart doesn't even make the list.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 5,
//   strength: 5,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Leonardo Giammichele",
//   number: 191,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508947,
//   },
//   rarity: "uncommon",
// };
//
