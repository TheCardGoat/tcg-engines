import type { CharacterCard } from "@tcg/lorcana-types";

export const blueFairyRewardingGoodDeeds: CharacterCard = {
  id: "tv6",
  cardType: "character",
  name: "Blue Fairy",
  version: "Rewarding Good Deeds",
  fullName: "Blue Fairy - Rewarding Good Deeds",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "002",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nETHEREAL GLOW Whenever you play a Floodborn character, you may draw a card.",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 36,
  inkable: true,
  externalIds: {
    ravensburger: "6ba38008e226dd2b1f7f7d339eda6aa832fd6eb3",
  },
  abilities: [
    {
      id: "tv6-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "tv6-2",
      type: "triggered",
      name: "ETHEREAL GLOW",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Floodborn",
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "ETHEREAL GLOW Whenever you play a Floodborn character, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Fairy"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverYouPlayAFloodBorn } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const blueFairyRewardingGoodDeeds: LorcanitoCharacterCard = {
//   id: "aid",
//   name: "Blue Fairy",
//   title: "Rewarding Good Deeds",
//   characteristics: ["storyborn", "ally", "fairy"],
//   text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**ETHEREAL GLOW** Whenever you play a Floodborn character, you may draw a card.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     wheneverYouPlayAFloodBorn({
//       optional: true,
//       text: "Whenever you play a Floodborn character, you may draw a card.",
//       name: "Ethereal Glow",
//       effects: [
//         {
//           type: "draw",
//           amount: 1,
//           target: {
//             type: "player",
//             value: "self",
//           },
//         },
//       ],
//     }),
//   ],
//   flavour:
//     "To make Geppetto's wish come true will be entirely up to you. –Blue Fairy",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 1,
//   willpower: 1,
//   lore: 1,
//   illustrator: "Kiersten Hale",
//   number: 36,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527542,
//   },
//   rarity: "uncommon",
// };
//
