import type { CharacterCard } from "@tcg/lorcana-types";

export const goliathGuardianOfCastleWyvern: CharacterCard = {
  id: "153",
  cardType: "character",
  name: "Goliath",
  version: "Guardian of Castle Wyvern",
  fullName: "Goliath - Guardian of Castle Wyvern",
  inkType: ["ruby"],
  franchise: "Gargoyles",
  set: "010",
  text: "BE CAREFUL, ALL OF YOU Whenever one of your Gargoyle characters challenges another character, gain 1 lore.\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
  cost: 4,
  strength: 5,
  willpower: 5,
  lore: 1,
  cardNumber: 119,
  inkable: true,
  externalIds: {
    ravensburger: "94203dcc3d9e5f0c52702076c16672e3178043be",
  },
  abilities: [
    {
      id: "153-1",
      text: "BE CAREFUL, ALL OF YOU Whenever one of your Gargoyle characters challenges another character, gain 1 lore.",
      name: "BE CAREFUL, ALL OF YOU",
      type: "triggered",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: {
          controller: "you",
          classification: "Gargoyle",
        },
      },
      effect: {
        type: "gain-lore",
        amount: 3,
      },
    },
    {
      id: "153-2",
      text: "STONE BY DAY If you have {d} or more cards in your hand, this character can't ready.",
      name: "STONE BY DAY",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
      },
      condition: {
        type: "resource-count",
        what: "cards-in-hand",
        controller: "you",
        comparison: "greater-or-equal",
        value: 0,
      },
    },
  ],
  classifications: ["Storyborn", "Hero", "Gargoyle"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverOneOfYourCharChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { stoneByDayAbility } from "@lorcanito/lorcana-engine/cards/010/abilities/stoneByDay";
//
// export const goliathGuardianOfCastleWyvern: LorcanitoCharacterCard = {
//   id: "ogv",
//   name: "Goliath",
//   title: "Guardian of Castle Wyvern",
//   characteristics: ["storyborn", "hero", "gargoyle"],
//   text: "BE CAREFUL, ALL OF YOU Whenever one of your Gargoyle characters challenges another character, gain 1 lore. STONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 5,
//   willpower: 5,
//   illustrator: "Max Grecke",
//   number: 119,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658295,
//   },
//   rarity: "uncommon",
//   lore: 1,
//   abilities: [
//     wheneverOneOfYourCharChallengesAnotherChar({
//       name: "BE CAREFUL, ALL OF YOU",
//       text: "Whenever one of your Gargoyle characters challenges another character, gain 1 lore.",
//       attackerFilter: [
//         { filter: "owner", value: "self" },
//         { filter: "characteristics", value: ["gargoyle"] },
//       ],
//       effects: [
//         {
//           type: "lore",
//           modifier: "add",
//           amount: 1,
//           target: {
//             type: "player",
//             value: "self",
//           },
//         },
//       ],
//     }),
//     stoneByDayAbility,
//   ],
// };
//
