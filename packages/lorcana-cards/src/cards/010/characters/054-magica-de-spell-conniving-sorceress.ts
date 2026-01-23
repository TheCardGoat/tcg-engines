import type { CharacterCard } from "@tcg/lorcana-types";

export const magicaDeSpellConnivingSorceress: CharacterCard = {
  id: "x7f",
  cardType: "character",
  name: "Magica De Spell",
  version: "Conniving Sorceress",
  fullName: "Magica De Spell - Conniving Sorceress",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "010",
  text: "Shift 7 {I} (You may pay 7 {I} to play this on top of one of your characters named Magica De Spell.)\nSHADOW'S GRASP When you play this character, if you used Shift to play her, you may draw 4 cards.",
  cost: 7,
  strength: 7,
  willpower: 7,
  lore: 1,
  cardNumber: 54,
  inkable: false,
  externalIds: {
    ravensburger: "77add645cd869348da0863c0ae18e4d8b4702127",
  },
  abilities: [
    {
      id: "x7f-1",
      text: "Shift 7 {I}",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 7,
      },
    },
    {
      id: "x7f-2",
      text: "SHADOW'S GRASP When you play this character, if you used Shift to play her, you may draw 4 cards.",
      name: "SHADOW'S GRASP",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "used-shift",
        },
        then: {
          type: "draw",
          amount: 4,
          target: "CONTROLLER",
        },
      },
    },
  ],
  classifications: ["Floodborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const magicaDeSpellConnivingSorceress: LorcanitoCharacterCard = {
//   id: "q8t",
//   name: "Magica De Spell",
//   title: "Conniving Sorceress",
//   characteristics: ["floodborn", "villain", "sorcerer"],
//   text: "Shift 7 {I} (You may pay 7 {I} to play this on top of one of your characters named Magica De Spell.) SHADOW'S GRASP When you play this character, if you used Shift to play her, you may draw 4 cards.",
//   type: "character",
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 7,
//   strength: 7,
//   willpower: 7,
//   illustrator: "Rebecka Helmersson",
//   number: 54,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659427,
//   },
//   rarity: "super_rare",
//   abilities: [
//     shiftAbility(7, "Magica De Spell"),
//     wheneverPlays({
//       name: "SHADOW'S GRASP",
//       text: "When you play this character, if you used Shift to play her, you may draw 4 cards.",
//       optional: true,
//       hasShifted: true,
//       triggerTarget: {
//         type: "card",
//         value: "all",
//         filters: [{ filter: "source", value: "self" }],
//       },
//       effects: [
//         {
//           type: "draw",
//           amount: 4,
//           target: {
//             type: "player",
//             value: "self",
//           },
//         },
//       ],
//     }),
//   ],
//   lore: 1,
// };
//
