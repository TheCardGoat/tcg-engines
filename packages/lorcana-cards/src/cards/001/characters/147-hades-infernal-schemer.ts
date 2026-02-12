import type { CharacterCard } from "@tcg/lorcana-types";

export const hadesInfernalSchemer: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "x36-1",
      text: "**IS THERE A DOWNSIDE TO THIS?** When you play this character, you may put chosen opposing character into their player",
      type: "action",
    },
  ],
  cardNumber: 147,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Deity"],
  cost: 7,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Hades - Infernal Schemer",
  id: "x36",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  name: "Hades",
  set: "001",
  strength: 3,
  text: "**IS THERE A DOWNSIDE TO THIS?** When you play this character, you may put chosen opposing character into their player",
  version: "Infernal Schemer",
  willpower: 6,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const hadesInfernalSchemer: LorcanitoCharacterCard = {
//   Id: "x36",
//   Reprints: ["a03"],
//   Name: "Hades",
//   Title: "Infernal Schemer",
//   Characteristics: ["dreamborn", "villain", "deity"],
//   Text: "**IS THERE A DOWNSIDE TO THIS?** When you play this character, you may put chosen opposing character into their player's inkwell facedown.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "Is There a Downside to This?",
//       Text: "When you play this character, you may put chosen opposing character into their player's inkwell facedown.",
//       Optional: true,
//       Effects: [
//         {
//           Type: "move",
//           To: "inkwell",
//           Exerted: true,
//           Target: chosenOpposingCharacter,
//         },
//       ],
//     }),
//   ],
//   Flavour: "He's gotta have a weakness, because everybody's got a weakness.",
//   Colors: ["sapphire"],
//   Cost: 7,
//   Strength: 3,
//   Willpower: 6,
//   Lore: 2,
//   Illustrator: "Matthew Robert Davies",
//   Number: 147,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508848,
//   },
//   Rarity: "legendary",
// };
//
