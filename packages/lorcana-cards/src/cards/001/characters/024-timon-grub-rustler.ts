import type { CharacterCard } from "@tcg/lorcana-types";

export const timonGrubRustler: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CHOSEN_CHARACTER",
          type: "remove-damage",
          upTo: true,
        },
        type: "optional",
      },
      id: "1fm-1",
      name: "TASTES LIKE CHICKEN",
      text: "TASTES LIKE CHICKEN When you play this character, you may remove up to 1 damage from chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 24,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 1,
  externalIds: {
    ravensburger: "ba040a5f880e4b2b3145703c8510a6d12b985cf9",
  },
  franchise: "Lion King",
  fullName: "Timon - Grub Rustler",
  id: "1fm",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  name: "Timon",
  set: "001",
  strength: 1,
  text: "TASTES LIKE CHICKEN When you play this character, you may remove up to 1 damage from chosen character.",
  version: "Grub Rustler",
  willpower: 2,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const timonGrubRustler: LorcanitoCharacterCard = {
//   Id: "bzz",
//   Name: "Timon",
//   Title: "Grub Rustler",
//   Characteristics: ["storyborn", "ally"],
//   Text: "**TASTES LIKE CHICKEN** When you play this character, you may remove up to 1 damage from chosen character.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "TASTES LIKE CHICKEN",
//       Text: "When you play this character, you may remove up to 1 damage from chosen character.",
//       Optional: true,
//       Effects: [
//         {
//           Type: "heal",
//           Amount: 1,
//           UpTo: true,
//           Target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
//   Flavour:
//     "There's all manner of tasty treats in the world−ya just gotta know where to look.",
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 1,
//   Strength: 1,
//   Willpower: 2,
//   Lore: 1,
//   Illustrator: "Juan Diego Leon",
//   Number: 24,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 497197,
//   },
//   Rarity: "common",
// };
//
