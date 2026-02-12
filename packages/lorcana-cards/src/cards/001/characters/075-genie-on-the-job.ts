import type { CharacterCard } from "@tcg/lorcana-types";

export const genieOnTheJob: CharacterCard = {
  abilities: [
    {
      id: "n53-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "return-to-hand",
          target: "CHOSEN_CHARACTER",
        },
        type: "optional",
      },
      id: "n53-2",
      name: "DISAPPEAR",
      text: "DISAPPEAR When you play this character, you may return chosen character to their player's hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 75,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 6,
  externalIds: {
    ravensburger: "53677bcf26b3b3a85ed1c61ea70cfd53296be7c2",
  },
  franchise: "Aladdin",
  fullName: "Genie - On the Job",
  id: "n53",
  inkType: ["emerald"],
  inkable: false,
  lore: 2,
  name: "Genie",
  set: "001",
  strength: 3,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nDISAPPEAR When you play this character, you may return chosen character to their player's hand.",
  version: "On the Job",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const genieOnTheJob: LorcanitoCharacterCard = {
//   Id: "tgk",
//   Name: "Genie",
//   Title: "On the Job",
//   Characteristics: ["storyborn", "ally"],
//   Text: "**Evasive** (_Only characters with Evasive can challenge this character._)\n**DISAPPEAR** When you play this character, you may return chosen character to their player's hand.",
//   Type: "character",
//   Abilities: [
//     EvasiveAbility,
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "Disappear",
//       Text: "When you play this character, you may return chosen character to their player's hand.",
//       Optional: true,
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
//   Flavour:
//     "Can your friends go ‘Abracadabra, let ’er rip’ and then make the sucker disappear?",
//   Colors: ["emerald"],
//   Cost: 6,
//   Strength: 3,
//   Willpower: 4,
//   Lore: 2,
//   Illustrator: "Giulia Riva",
//   Number: 75,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 501228,
//   },
//   Rarity: "super_rare",
// };
//
