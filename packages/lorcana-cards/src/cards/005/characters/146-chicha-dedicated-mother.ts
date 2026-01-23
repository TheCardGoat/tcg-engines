import type { CharacterCard } from "@tcg/lorcana-types";

export const chichaDedicatedMother: CharacterCard = {
  id: "q5f",
  cardType: "character",
  name: "Chicha",
  version: "Dedicated Mother",
  fullName: "Chicha - Dedicated Mother",
  inkType: ["sapphire"],
  franchise: "Emperors New Groove",
  set: "005",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nONE ON THE WAY During your turn, when you put a card into your inkwell, if it's the second card you've put into your inkwell this turn, you may draw a card.",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 146,
  inkable: false,
  externalIds: {
    ravensburger: "5e3fa2a8aeb1d42d259f76ba44d01ee2b3db912c",
  },
  abilities: [
    {
      id: "q5f-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
    {
      id: "q5f-2",
      type: "triggered",
      name: "ONE ON THE WAY",
      trigger: {
        event: "ink",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression:
            "it's the second card you've put into your inkwell this turn",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
      text: "ONE ON THE WAY During your turn, when you put a card into your inkwell, if it's the second card you've put into your inkwell this turn, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const chichaDedicatedMother: LorcanitoCharacterCard = {
//   id: "lux",
//   name: "Chicha",
//   title: "Dedicated Mother",
//   characteristics: ["storyborn", "ally"],
//   text: "**Support** _(Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)_ **ONE ON THE WAY** During your turn, when you put a card into your inkwell, if it’s the second card you’ve put into your inkwell this turn, you may draw a card.",
//   type: "character",
//   abilities: [
//     supportAbility,
//     {
//       type: "static-triggered",
//       name: "On the way",
//       text: "During your turn, when you put a card into your inkwell, if it’s the second card you’ve put into your inkwell this turn, you may draw a card.",
//       conditions: [
//         {
//           type: "during-turn",
//           value: "self",
//         },
//       ],
//       trigger: {
//         on: "inkwell",
//         target: {
//           type: "card",
//           value: "all",
//           filters: [
//             { filter: "owner", value: "self" },
//             {
//               filter: "turn",
//               value: "inkwell",
//               targetFilter: [{ filter: "owner", value: "self" }],
//               comparison: { operator: "eq", value: 2 },
//             },
//           ],
//         },
//       },
//       layer: {
//         type: "resolution",
//         name: "On the way",
//         text: "During your turn, when you put a card into your inkwell, if it’s the second card you’ve put into your inkwell this turn, you may draw a card.",
//         optional: true,
//         effects: [drawACard],
//       },
//     },
//   ],
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 2,
//   willpower: 1,
//   lore: 1,
//   illustrator: "Grace Tran",
//   number: 146,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560514,
//   },
//   rarity: "rare",
// };
//
