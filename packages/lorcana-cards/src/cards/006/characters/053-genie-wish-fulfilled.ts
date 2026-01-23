import type { CharacterCard } from "@tcg/lorcana-types";

export const genieWishFulfilled: CharacterCard = {
  id: "n6c",
  cardType: "character",
  name: "Genie",
  version: "Wish Fulfilled",
  fullName: "Genie - Wish Fulfilled",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "006",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nWHAT HAPPENS NOW? When you play this character, draw a card.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 53,
  inkable: false,
  externalIds: {
    ravensburger: "53873ab78cd68666de74c7d32546d4290f86353b",
  },
  abilities: [
    {
      id: "n6c-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
    {
      id: "n6c-2",
      text: "WHAT HAPPENS NOW? When you play this character, draw a card.",
      name: "WHAT HAPPENS NOW?",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenYouPlayMayDrawACard } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const genieWishFulfilled: LorcanitoCharacterCard = {
//   id: "xl7",
//   missingTestCase: true,
//   name: "Genie",
//   title: "Wish Fulfilled",
//   characteristics: ["dreamborn", "ally"],
//   text: "Evasive (Only characters with Evasive can challenge this character.)\nWHAT COMES NEXT? When you play this character, draw a card.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     {
//       ...whenYouPlayMayDrawACard,
//       name: "What Comes Next?",
//       text: "When you play this character, you may draw a card.",
//       optional: false,
//     },
//   ],
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Veronica Di Lorenzo / Livio Cacciatore",
//   number: 53,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593007,
//   },
//   rarity: "rare",
// };
//
