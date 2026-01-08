import type { CharacterCard } from "@tcg/lorcana-types";

export const arielWhoseitCollector: CharacterCard = {
  id: "df2",
  cardType: "character",
  name: "Ariel",
  version: "Whoseit Collector",
  fullName: "Ariel - Whoseit Collector",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "**LOOK AT THIS STUFF** Whenever you play an item, you may ready this character.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 137,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "c6b-1",
      text: "**PRINCE'S CHARM** You may ready this character.",
      effect: {
        type: "optional",
        effect: {
          type: "ready",
          target: {
            selector: "self",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Hero", "Storyborn", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const arielWhoseitCollector: LorcanitoCharacterCard = {
//   id: "df2",
//   name: "Ariel",
//   title: "Whoseit Collector",
//   characteristics: ["hero", "storyborn", "princess"],
//   text: "**LOOK AT THIS STUFF** Whenever you play an item, you may ready this character.",
//   type: "character",
//   abilities: [
//     wheneverPlays({
//       name: "Look at This Stuff",
//       text: "Whenever you play an item, you may ready this character.",
//       optional: true,
//       triggerTarget: {
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "item" },
//           { filter: "owner", value: "self" },
//         ],
//       },
//       effects: [
//         {
//           type: "exert",
//           exert: false,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "source", value: "self" }],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: "You want thingamabobs? I got twenty.",
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Hedvig Häggman-Sund",
//   number: 137,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 502532,
//   },
//   rarity: "rare",
// };
//
