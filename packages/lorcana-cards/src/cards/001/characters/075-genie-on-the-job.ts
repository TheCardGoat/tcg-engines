import type { CharacterCard } from "@tcg/lorcana-types";

export const genieOnTheJob: CharacterCard = {
  id: "n53",
  cardType: "character",
  name: "Genie",
  version: "On the Job",
  fullName: "Genie - On the Job",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "001",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nDISAPPEAR When you play this character, you may return chosen character to their player's hand.",
  cost: 6,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 75,
  inkable: false,
  externalIds: {
    ravensburger: "53677bcf26b3b3a85ed1c61ea70cfd53296be7c2",
  },
  abilities: [
    {
      id: "n53-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
    {
      id: "n53-2",
      text: "DISAPPEAR When you play this character, you may return chosen character to their player's hand.",
      name: "DISAPPEAR",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const genieOnTheJob: LorcanitoCharacterCard = {
//   id: "tgk",
//   name: "Genie",
//   title: "On the Job",
//   characteristics: ["storyborn", "ally"],
//   text: "**Evasive** (_Only characters with Evasive can challenge this character._)\n**DISAPPEAR** When you play this character, you may return chosen character to their player's hand.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       name: "Disappear",
//       text: "When you play this character, you may return chosen character to their player's hand.",
//       optional: true,
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
//   flavour:
//     "Can your friends go ‘Abracadabra, let ’er rip’ and then make the sucker disappear?",
//   colors: ["emerald"],
//   cost: 6,
//   strength: 3,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Giulia Riva",
//   number: 75,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 501228,
//   },
//   rarity: "super_rare",
// };
//
