import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaLostPrince: CharacterCard = {
  id: "1e1",
  cardType: "character",
  name: "Simba",
  version: "Lost Prince",
  fullName: "Simba - Lost Prince",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "005",
  text: "FACE THE PAST During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 173,
  inkable: true,
  externalIds: {
    ravensburger: "b66d745358da7ec9b30e05117dd8f73ea6ae5746",
  },
  abilities: [
    {
      id: "1e1-1",
      type: "triggered",
      name: "FACE THE PAST",
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
      text: "FACE THE PAST During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverBanishesAnotherCharacterInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const simbaLostPrince: LorcanitoCharacterCard = {
//   id: "ltv",
//   missingTestCase: true,
//   name: "Simba",
//   title: "Lost Prince",
//   characteristics: ["hero", "storyborn", "prince"],
//   text: "**FACE THE PAST** During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
//   type: "character",
//   abilities: [
//     wheneverBanishesAnotherCharacterInChallenge({
//       name: "Face The Past",
//       text: "During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
//       optional: true,
//       effects: [drawACard],
//     }),
//   ],
//   flavour: '"This is my kingdom. If I don\'t fight for it, who will?"',
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 2,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Alexandria Neonakis",
//   number: 173,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560243,
//   },
//   rarity: "common",
// };
//
