import type { CharacterCard } from "@tcg/lorcana-types";

export const rayaUnstoppableForce: CharacterCard = {
  id: "jk9",
  cardType: "character",
  name: "Raya",
  version: "Unstoppable Force",
  fullName: "Raya - Unstoppable Force",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  text: "Challenger +2 (While challenging, this character gets +2 {S}.)\nResist +2 (Damage dealt to this character is reduced by 2.)\nYOU GAVE IT YOUR BEST During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 193,
  inkable: true,
  externalIds: {
    ravensburger: "01f560e64dbad8d5d3b665a79d9438c1da824796",
  },
  abilities: [
    {
      id: "jk9-1",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
      text: "Challenger +2",
    },
    {
      id: "jk9-2",
      type: "keyword",
      keyword: "Resist",
      value: 2,
      text: "Resist +2",
    },
    {
      id: "jk9-3",
      type: "triggered",
      name: "YOU GAVE IT YOUR BEST",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "OPPONENT_CHARACTERS",
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
      text: "YOU GAVE IT YOUR BEST During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   challengerAbility,
//   resistAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverBanishesAnotherCharacterInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const rayaUnstoppableForce: LorcanitoCharacterCard = {
//   id: "db2",
//   missingTestCase: true,
//   name: "Raya",
//   title: "Unstoppable Force",
//   characteristics: ["hero", "dreamborn", "princess"],
//   text: "**Challenger +2** _(While challenging, this character gets +2 {S}.)_\n\n\n**Resist +2** _(Damage dealt to this character is reduced by 2.)_\n\n\n**YOU GAVE IT YOUR BEST** During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
//   type: "character",
//   abilities: [
//     challengerAbility(2),
//     resistAbility(2),
//     wheneverBanishesAnotherCharacterInChallenge({
//       name: "YOU GAVE IT YOUR BEST",
//       text: "During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
//       optional: true,
//       effects: [drawACard],
//     }),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 7,
//   strength: 3,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Grace Tran",
//   number: 193,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550621,
//   },
//   rarity: "super_rare",
// };
//
