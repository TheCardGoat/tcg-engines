import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaExploringTheUnknown: CharacterCard = {
  id: "744",
  cardType: "character",
  name: "Elsa",
  version: "Exploring the Unknown",
  fullName: "Elsa - Exploring the Unknown",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "010",
  text: "CLOSER LOOK When you play this character, you may draw a card.",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 45,
  inkable: true,
  externalIds: {
    ravensburger: "19a46ebcde9538732365e630c3cd5a56fd6ec603",
  },
  abilities: [
    {
      id: "744-1",
      type: "triggered",
      name: "CLOSER LOOK",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
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
      text: "CLOSER LOOK When you play this character, you may draw a card.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Queen", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const elsaExploringTheUnknown: LorcanitoCharacterCard = {
//   id: "mjm",
//   name: "Elsa",
//   title: "Exploring the Unknown",
//   characteristics: ["dreamborn", "hero", "queen", "sorcerer"],
//   text: "CLOSER LOOK When you play this character, you may draw a card.",
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 1,
//   willpower: 3,
//   illustrator: "Clio Wolfensberger",
//   number: 45,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658466,
//   },
//   rarity: "common",
//   lore: 1,
//   abilities: [
//     whenYouPlayThisCharacter({
//       effects: [drawACard],
//       name: "CLOSER LOOK",
//       text: "When you play this character, you may draw a card.",
//       optional: true,
//     }),
//   ],
// };
//
