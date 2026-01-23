import type { CharacterCard } from "@tcg/lorcana-types";

export const timonGrubRustler: CharacterCard = {
  id: "1fm",
  cardType: "character",
  name: "Timon",
  version: "Grub Rustler",
  fullName: "Timon - Grub Rustler",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "001",
  text: "TASTES LIKE CHICKEN When you play this character, you may remove up to 1 damage from chosen character.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 24,
  inkable: true,
  externalIds: {
    ravensburger: "ba040a5f880e4b2b3145703c8510a6d12b985cf9",
  },
  abilities: [
    {
      id: "1fm-1",
      text: "TASTES LIKE CHICKEN When you play this character, you may remove up to 1 damage from chosen character.",
      name: "TASTES LIKE CHICKEN",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 1,
          target: "CHOSEN_CHARACTER",
          upTo: true,
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const timonGrubRustler: LorcanitoCharacterCard = {
//   id: "bzz",
//   name: "Timon",
//   title: "Grub Rustler",
//   characteristics: ["storyborn", "ally"],
//   text: "**TASTES LIKE CHICKEN** When you play this character, you may remove up to 1 damage from chosen character.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       name: "TASTES LIKE CHICKEN",
//       text: "When you play this character, you may remove up to 1 damage from chosen character.",
//       optional: true,
//       effects: [
//         {
//           type: "heal",
//           amount: 1,
//           upTo: true,
//           target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
//   flavour:
//     "There's all manner of tasty treats in the world−ya just gotta know where to look.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   strength: 1,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Juan Diego Leon",
//   number: 24,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 497197,
//   },
//   rarity: "common",
// };
//
