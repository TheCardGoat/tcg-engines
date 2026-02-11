import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyTremaineWickedStepmother: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "return-from-discard",
          cardType: "action",
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      id: "qdk-1",
      name: "DO IT AGAIN!",
      text: "DO IT AGAIN! When you play this character, you may return an action card from your discard to your hand.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 85,
  cardType: "character",
  cost: 6,
  externalIds: {
    ravensburger: "5f10313dc8b4bca05c0fcd2a13d6b70db3cee3a8",
  },
  franchise: "Cinderella",
  fullName: "Lady Tremaine - Wicked Stepmother",
  id: "qdk",
  inkType: ["emerald"],
  inkable: false,
  lore: 1,
  name: "Lady Tremaine",
  set: "001",
  strength: 1,
  text: "DO IT AGAIN! When you play this character, you may return an action card from your discard to your hand.",
  version: "Wicked Stepmother",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const ladyTremaine: LorcanitoCharacterCard = {
//   Id: "ucd",
//
//   Name: "Lady Tremaine",
//   Title: "Wicked Stepmother",
//   Characteristics: ["dreamborn", "villain"],
//   Text: "**Do it again!** When you play this character, you may return an action card from your discard to your hand.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Optional: true,
//       Name: "DO IT AGAIN!",
//       Text: "When you play this character, you may return an action card from your discard to your hand.",
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Exerted: false,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "action" },
//               { filter: "zone", value: "discard" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Flavour: '"If your chores are done, then clearly you..."',
//   Colors: ["emerald"],
//   Cost: 6,
//   Strength: 1,
//   Willpower: 5,
//   Lore: 1,
//   Illustrator: "Leonardo Giammichele",
//   Number: 85,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 489665,
//   },
//   Rarity: "rare",
// };
//
