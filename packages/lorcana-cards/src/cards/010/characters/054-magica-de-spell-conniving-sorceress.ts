import type { CharacterCard } from "@tcg/lorcana-types";

export const magicaDeSpellConnivingSorceress: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 7,
      },
      id: "x7f-1",
      keyword: "Shift",
      text: "Shift 7 {I}",
      type: "keyword",
    },
    {
      effect: {
        condition: {
          type: "used-shift",
        },
        then: {
          amount: 4,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "conditional",
      },
      id: "x7f-2",
      name: "SHADOW'S GRASP",
      text: "SHADOW'S GRASP When you play this character, if you used Shift to play her, you may draw 4 cards.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 54,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "Sorcerer"],
  cost: 7,
  externalIds: {
    ravensburger: "77add645cd869348da0863c0ae18e4d8b4702127",
  },
  franchise: "Ducktales",
  fullName: "Magica De Spell - Conniving Sorceress",
  id: "x7f",
  inkType: ["amethyst"],
  inkable: false,
  lore: 1,
  name: "Magica De Spell",
  set: "010",
  strength: 7,
  text: "Shift 7 {I} (You may pay 7 {I} to play this on top of one of your characters named Magica De Spell.)\nSHADOW'S GRASP When you play this character, if you used Shift to play her, you may draw 4 cards.",
  version: "Conniving Sorceress",
  willpower: 7,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// Export const magicaDeSpellConnivingSorceress: LorcanitoCharacterCard = {
//   Id: "q8t",
//   Name: "Magica De Spell",
//   Title: "Conniving Sorceress",
//   Characteristics: ["floodborn", "villain", "sorcerer"],
//   Text: "Shift 7 {I} (You may pay 7 {I} to play this on top of one of your characters named Magica De Spell.) SHADOW'S GRASP When you play this character, if you used Shift to play her, you may draw 4 cards.",
//   Type: "character",
//   Inkwell: false,
//   Colors: ["amethyst"],
//   Cost: 7,
//   Strength: 7,
//   Willpower: 7,
//   Illustrator: "Rebecka Helmersson",
//   Number: 54,
//   Set: "010",
//   ExternalIds: {
//     TcgPlayer: 659427,
//   },
//   Rarity: "super_rare",
//   Abilities: [
//     ShiftAbility(7, "Magica De Spell"),
//     WheneverPlays({
//       Name: "SHADOW'S GRASP",
//       Text: "When you play this character, if you used Shift to play her, you may draw 4 cards.",
//       Optional: true,
//       HasShifted: true,
//       TriggerTarget: {
//         Type: "card",
//         Value: "all",
//         Filters: [{ filter: "source", value: "self" }],
//       },
//       Effects: [
//         {
//           Type: "draw",
//           Amount: 4,
//           Target: {
//             Type: "player",
//             Value: "self",
//           },
//         },
//       ],
//     }),
//   ],
//   Lore: 1,
// };
//
