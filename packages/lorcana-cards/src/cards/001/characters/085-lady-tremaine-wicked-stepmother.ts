import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyTremaineWickedStepmother: CharacterCard = {
  id: "qdk",
  cardType: "character",
  name: "Lady Tremaine",
  version: "Wicked Stepmother",
  fullName: "Lady Tremaine - Wicked Stepmother",
  inkType: ["emerald"],
  franchise: "Cinderella",
  set: "001",
  text: "DO IT AGAIN! When you play this character, you may return an action card from your discard to your hand.",
  cost: 6,
  strength: 1,
  willpower: 5,
  lore: 1,
  cardNumber: 85,
  inkable: false,
  externalIds: {
    ravensburger: "5f10313dc8b4bca05c0fcd2a13d6b70db3cee3a8",
  },
  abilities: [
    {
      id: "qdk-1",
      text: "DO IT AGAIN! When you play this character, you may return an action card from your discard to your hand.",
      name: "DO IT AGAIN!",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-from-discard",
          cardType: "action",
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const ladyTremaine: LorcanitoCharacterCard = {
//   id: "ucd",
//
//   name: "Lady Tremaine",
//   title: "Wicked Stepmother",
//   characteristics: ["dreamborn", "villain"],
//   text: "**Do it again!** When you play this character, you may return an action card from your discard to your hand.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       optional: true,
//       name: "DO IT AGAIN!",
//       text: "When you play this character, you may return an action card from your discard to your hand.",
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           exerted: false,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "action" },
//               { filter: "zone", value: "discard" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: '"If your chores are done, then clearly you..."',
//   colors: ["emerald"],
//   cost: 6,
//   strength: 1,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Leonardo Giammichele",
//   number: 85,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 489665,
//   },
//   rarity: "rare",
// };
//
