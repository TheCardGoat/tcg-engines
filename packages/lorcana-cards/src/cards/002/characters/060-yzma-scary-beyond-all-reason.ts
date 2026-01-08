import type { CharacterCard } from "@tcg/lorcana-types";

export const yzmaScaryBeyondAllReason: CharacterCard = {
  id: "1c0",
  cardType: "character",
  name: "Yzma",
  version: "Scary Beyond All Reason",
  fullName: "Yzma - Scary Beyond All Reason",
  inkType: ["amethyst"],
  franchise: "Emperors New Groove",
  set: "002",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Yzma.)\nCRUEL IRONY When you play this character, shuffle another chosen character card into their player's deck. That player draws 2 cards.",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 60,
  inkable: true,
  externalIds: {
    ravensburger: "ad11b54a7e07094083dc887eb31edc68945a31d0",
  },
  abilities: [
    {
      id: "1c0-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4",
    },
    {
      id: "1c0-2",
      type: "triggered",
      name: "CRUEL IRONY",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
      text: "CRUEL IRONY When you play this character, shuffle another chosen character card into their player's deck. That player draws 2 cards.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { anotherChosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { targetOwnerDrawsXCards } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const yzmaScaryBeyondAllReason: LorcanitoCharacterCard = {
//   id: "xdq",
//   name: "Yzma",
//   title: "Scary Beyond All Reason",
//   characteristics: ["floodborn", "sorcerer", "villain"],
//   text: "**Shift** 4\n\n**CRUEL IRONY** When you play this character, shuffle another chosen character card into their player's deck. That player draws 2 cards.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Cruel Irony",
//       text: "When you play this character, shuffle another chosen character card into their player's deck. That player draws 2 cards.",
//       dependentEffects: true,
//       effects: [
//         {
//           type: "shuffle",
//           target: anotherChosenCharacter,
//         },
//         targetOwnerDrawsXCards(2),
//       ],
//     },
//     shiftAbility(4, "yzma"),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 6,
//   strength: 4,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Casey Robin",
//   number: 60,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527739,
//   },
//   rarity: "super_rare",
// };
//
