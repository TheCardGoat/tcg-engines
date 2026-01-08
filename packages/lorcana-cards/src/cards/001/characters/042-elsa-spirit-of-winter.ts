import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaSpiritOfWinter: CharacterCard = {
  id: "qc4",
  cardType: "character",
  name: "Elsa",
  version: "Spirit of Winter",
  fullName: "Elsa - Spirit of Winter",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**Shift** 6 _(You may pay 6 {I} to play this on top of one of your characters named Elsa.)_\n\n**DEEP FREEZE** When you play this character, exert up to 2 chosen characters. They can",
  cost: 8,
  strength: 4,
  willpower: 6,
  lore: 3,
  cardNumber: 42,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**Shift** 6 _(You may pay 6 {I} to play this on top of one of your characters named Elsa.)_\n\n**DEEP FREEZE** When you play this character, exert up to 2 chosen characters. They can",
      id: "qc4-1",
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "hand",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Hero", "Floodborn", "Queen", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { exertAndCantReadyAtTheeStartOfTheirTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const elsaSpiritOfWinter: LorcanitoCharacterCard = {
//   id: "qc4",
//   reprints: ["qun"],
//   name: "Elsa",
//   title: "Spirit of Winter",
//   characteristics: ["hero", "floodborn", "queen", "sorcerer"],
//   text: "**Shift** 6 _(You may pay 6 {I} to play this on top of one of your characters named Elsa.)_\n\n**DEEP FREEZE** When you play this character, exert up to 2 chosen characters. They can't ready at the start of their next turn.",
//   type: "character",
//   abilities: [
//     shiftAbility(6, "Elsa"),
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       optional: true,
//       name: "DEEP FREEZE",
//       text: "When you play this character, exert up to 2 chosen characters. They can't ready at the start of their next turn.",
//       effects: exertAndCantReadyAtTheeStartOfTheirTurn({
//         type: "card",
//         value: 2,
//         upTo: true,
//         filters: [
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//         ],
//       }),
//     }),
//   ],
//   flavour: "Ice is stronger than you may think.",
//   colors: ["amethyst"],
//   cost: 8,
//   strength: 4,
//   willpower: 6,
//   lore: 3,
//   illustrator: "Matthew Robert Davies",
//   number: 42,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 507512,
//   },
//   rarity: "legendary",
// };
//
