import type { CharacterCard } from "@tcg/lorcana-types";

export const shenziHeadHyena: CharacterCard = {
  id: "19k",
  cardType: "character",
  name: "Shenzi",
  version: "Head Hyena",
  fullName: "Shenzi - Head Hyena",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "005",
  text: "STICK AROUND FOR DINNER This character gets +1 {S} for each other Hyena character you have in play.\nWHAT HAVE WE GOT HERE? Whenever one of your Hyena characters challenges a damaged character, gain 2 lore.",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 1,
  cardNumber: 91,
  inkable: true,
  externalIds: {
    ravensburger: "a43275cadb3c2ca378ed736dd05c7340b53c39e7",
  },
  abilities: [
    {
      id: "19k-1",
      text: "STICK AROUND FOR DINNER This character gets +1 {S} for each other Hyena character you have in play.",
      name: "STICK AROUND FOR DINNER",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: {
          type: "classification-character-count",
          classification: "Hyena",
          controller: "you",
        },
        target: "SELF",
      },
    },
    {
      id: "19k-2",
      text: "WHAT HAVE WE GOT HERE? Whenever one of your Hyena characters challenges a damaged character, gain 2 lore.",
      name: "WHAT HAVE WE GOT HERE?",
      type: "triggered",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: {
          controller: "you",
          classification: "Hyena",
        },
        defender: {
          filters: [{ type: "damaged" }],
        },
      },
      effect: {
        type: "gain-lore",
        amount: 0,
      },
    },
  ],
  classifications: ["Storyborn", "Ally", "Hyena"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import type { StaticAbilityWithEffect } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverOneOfYourCharChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// const stickAroundForDinner: StaticAbilityWithEffect = {
//   type: "static",
//   ability: "effects",
//   name: "Stick Around For Dinner",
//   text: "This character gets +1 {S} for each other Hyena character you have in play.",
//   effects: [
//     {
//       type: "attribute",
//       attribute: "strength",
//       amount: {
//         dynamic: true,
//         excludeSelf: true,
//         filters: [
//           { filter: "zone", value: "play" },
//           { filter: "owner", value: "self" },
//           { filter: "type", value: "character" },
//           { filter: "characteristics", value: ["hyena"] },
//         ],
//       },
//       modifier: "add",
//       target: thisCharacter,
//     },
//   ],
// };
//
// export const shenziHeadHyena: LorcanitoCharacterCard = {
//   id: "m32",
//   name: "Shenzi",
//   title: "Head Hyena",
//   characteristics: ["storyborn", "ally", "hyena"],
//   text: "**STICK AROUND FOR DINNER** This character gets +1 {S} for each other Hyena character you have in play. **WHAT HAVE WE GOT HERE?** Whenever one of your Hyena characters challenges a damaged character, gain 2 lore.",
//   type: "character",
//   abilities: [
//     stickAroundForDinner,
//     wheneverOneOfYourCharChallengesAnotherChar({
//       name: "WHAT HAVE WE GOT HERE",
//       text: "Whenever one of your Hyena characters challenges a damaged character, gain 2 lore.",
//       effects: [youGainLore(2)],
//       defenderFilter: [
//         {
//           filter: "status",
//           value: "damage",
//           comparison: { operator: "gt", value: 0 },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 5,
//   strength: 3,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Otto Paredes",
//   number: 91,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561169,
//   },
//   rarity: "rare",
// };
//
