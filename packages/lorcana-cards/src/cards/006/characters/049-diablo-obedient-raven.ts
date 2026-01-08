import type { CharacterCard } from "@tcg/lorcana-types";

export const diabloObedientRaven: CharacterCard = {
  id: "1vn",
  cardType: "character",
  name: "Diablo",
  version: "Obedient Raven",
  fullName: "Diablo - Obedient Raven",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "006",
  text: "FLY, MY PET! When this character is banished, you may draw a card.",
  cost: 1,
  strength: 0,
  willpower: 1,
  lore: 1,
  cardNumber: 49,
  inkable: true,
  externalIds: {
    ravensburger: "f3ce8367f80305c407529f4e5600ff95c7d60c92",
  },
  abilities: [
    {
      id: "1vn-1",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "FLY, MY PET! When this character is banished, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const diabloObedientRaven: LorcanitoCharacterCard = {
//   id: "gsz",
//   name: "Diablo",
//   title: "Obedient Raven",
//   characteristics: ["storyborn", "ally"],
//   text: "FLY, MY PET! When this character is banished, you may draw a card.",
//   type: "character",
//   abilities: [
//     whenThisCharacterBanished({
//       name: "Fly, My Pet!",
//       text: "When this character is banished, you may draw a card.",
//       optional: true,
//       effects: [drawACard],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 1,
//   strength: 0,
//   willpower: 1,
//   lore: 1,
//   illustrator: "Jennifer Wu",
//   number: 49,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588337,
//   },
//   rarity: "uncommon",
// };
//
