import type { CharacterCard } from "@tcg/lorcana-types";

export const hadesInfernalSchemer: CharacterCard = {
  id: "x36",
  cardType: "character",
  name: "Hades",
  version: "Infernal Schemer",
  fullName: "Hades - Infernal Schemer",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "**IS THERE A DOWNSIDE TO THIS?** When you play this character, you may put chosen opposing character into their player",
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 147,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**IS THERE A DOWNSIDE TO THIS?** When you play this character, you may put chosen opposing character into their player",
      id: "x36-1",
      effect: {
        type: "play-card",
        from: "hand",
      },
    },
  ],
  classifications: ["Dreamborn", "Villain", "Deity"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const hadesInfernalSchemer: LorcanitoCharacterCard = {
//   id: "x36",
//   reprints: ["a03"],
//   name: "Hades",
//   title: "Infernal Schemer",
//   characteristics: ["dreamborn", "villain", "deity"],
//   text: "**IS THERE A DOWNSIDE TO THIS?** When you play this character, you may put chosen opposing character into their player's inkwell facedown.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       name: "Is There a Downside to This?",
//       text: "When you play this character, you may put chosen opposing character into their player's inkwell facedown.",
//       optional: true,
//       effects: [
//         {
//           type: "move",
//           to: "inkwell",
//           exerted: true,
//           target: chosenOpposingCharacter,
//         },
//       ],
//     }),
//   ],
//   flavour: "He's gotta have a weakness, because everybody's got a weakness.",
//   colors: ["sapphire"],
//   cost: 7,
//   strength: 3,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Matthew Robert Davies",
//   number: 147,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508848,
//   },
//   rarity: "legendary",
// };
//
