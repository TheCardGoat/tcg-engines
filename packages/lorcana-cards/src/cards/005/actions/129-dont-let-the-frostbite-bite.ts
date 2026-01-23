import type { ActionCard } from "@tcg/lorcana-types";

export const dontLetTheFrostbiteBite: ActionCard = {
  id: "cu3",
  cardType: "action",
  name: "Don't Let the Frostbite Bite",
  inkType: ["ruby"],
  franchise: "Frozen",
  set: "005",
  text: "Ready all your characters. They can't quest for the rest of this turn.",
  actionSubtype: "song",
  cost: 7,
  cardNumber: 129,
  inkable: true,
  externalIds: {
    ravensburger: "2e42cd9c7fabd5179439829be568bfd49bf41ac9",
  },
  abilities: [
    {
      id: "cu3-1",
      text: "Ready all your characters. They can't quest for the rest of this turn.",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "ready",
            target: {
              selector: "all",
              owner: "you",
              count: "all",
            },
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: {
              selector: "all",
              owner: "you",
              count: "all",
            },
            duration: "this-turn",
          },
        ],
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { allYourCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
// import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const dontLetTheFrostbiteBite: LorcanitoActionCard = {
//   id: "rdl",
//   missingTestCase: true,
//   name: "Don't Let the Frostbite Bite",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 7 or more can \n {E} to sing this song for free.)_<br>Ready all your characters. They can’t quest for the rest of this turn.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Ready all your characters. They can’t quest for the rest of this turn.",
//       effects: readyAndCantQuest(allYourCharacters),
//     },
//   ],
//   flavour: "Let’s call it a night",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 7,
//   illustrator: "Linh Dang",
//   number: 129,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560524,
//   },
//   rarity: "rare",
// };
//
