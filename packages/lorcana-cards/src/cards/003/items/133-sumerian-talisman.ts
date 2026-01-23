import type { ItemCard } from "@tcg/lorcana-types";

export const sumerianTalisman: ItemCard = {
  id: "xe8",
  cardType: "item",
  name: "Sumerian Talisman",
  inkType: ["ruby"],
  franchise: "Ducktales",
  set: "003",
  text: "SOURCE OF MAGIC During your turn, whenever one of your characters is banished in a challenge, you may draw a card.",
  cost: 3,
  cardNumber: 133,
  inkable: true,
  externalIds: {
    ravensburger: "785c3874dacb812c954b54cfba364b5a22125aa3",
  },
  abilities: [
    {
      id: "xe8-1",
      type: "triggered",
      name: "SOURCE OF MAGIC",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
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
      text: "SOURCE OF MAGIC During your turn, whenever one of your characters is banished in a challenge, you may draw a card.",
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { wheneverOneOfYourCharactersIsBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const sumerianTalisman: LorcanitoItemCard = {
//   id: "ui2",
//   missingTestCase: true,
//   name: "Sumerian Talisman",
//   characteristics: ["item"],
//   text: "**SOURCE OF MAGIC** During your turn, whenever one of your characters is banished in a challenge, you may draw a card.",
//   type: "item",
//   abilities: [
//     wheneverOneOfYourCharactersIsBanishedInAChallenge({
//       name: "Source of Magic",
//       text: "During your turn, whenever one of your characters is banished in a challenge, you may draw a card.",
//       optional: true,
//       conditions: [{ type: "during-turn", value: "self" }],
//       triggerFilter: [
//         { filter: "owner", value: "self" },
//         { filter: "type", value: "character" },
//       ],
//       effects: [drawACard],
//     }),
//   ],
//   flavour:
//     "Summoned spirit from the dark \nShow thyself before this arc. \n−Lena Sabrewing",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   illustrator: "Adam Bunch",
//   number: 133,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 536271,
//   },
//   rarity: "uncommon",
// };
//
