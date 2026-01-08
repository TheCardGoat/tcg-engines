import type { CharacterCard } from "@tcg/lorcana-types";

export const nickWildePersistentInvestigator: CharacterCard = {
  id: "17t",
  cardType: "character",
  name: "Nick Wilde",
  version: "Persistent Investigator",
  fullName: "Nick Wilde - Persistent Investigator",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "010",
  text: "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Nick Wilde.)\nCASE CLOSED During your turn, whenever one of your Detective characters banishes another character in a challenge, draw a card.",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 2,
  cardNumber: 187,
  inkable: false,
  externalIds: {
    ravensburger: "9df2d82945c4e41f639517730cc0186f08e38d71",
  },
  abilities: [
    {
      id: "17t-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3 {I}",
    },
    {
      id: "17t-2",
      type: "triggered",
      name: "CASE CLOSED",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "CASE CLOSED During your turn, whenever one of your Detective characters banishes another character in a challenge, draw a card.",
    },
  ],
  classifications: ["Floodborn", "Ally", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverOpposingCharIsBanishedInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const nickWildePersistentInvestigator: LorcanitoCharacterCard = {
//   id: "f1z",
//   name: "Nick Wilde",
//   title: "Persistent Investigator",
//   missingTestCase: true,
//   characteristics: ["floodborn", "ally", "detective"],
//   text: "Shift 3 (You may pay 3 to play this on top of one of your characters named Nick Wilde.) CASE CLOSED During your turn, whenever one of your Detective characters banishes another character in a challenge, draw a card.",
//   type: "character",
//   inkwell: false,
//   colors: ["steel"],
//   cost: 5,
//   strength: 5,
//   willpower: 4,
//   illustrator: "César Vergara / Alex Accorsi",
//   number: 187,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 653915,
//   },
//   rarity: "rare",
//   lore: 2,
//   abilities: [
//     shiftAbility(3, "Nick Wilde"),
//     wheneverOpposingCharIsBanishedInChallenge({
//       name: "CASE CLOSED",
//       text: "During your turn, whenever one of your Detective characters banishes another character in a challenge, draw a card.",
//       conditions: [
//         {
//           type: "during-turn",
//           value: "self",
//         },
//       ],
//       attackerFilters: [
//         { filter: "owner", value: "self" },
//         { filter: "type", value: "character" },
//         { filter: "characteristics", value: ["detective"] },
//         { filter: "zone", value: "play" },
//         { filter: "challenge", value: "attacker" },
//       ],
//       effects: [drawACard],
//     }),
//   ],
// };
//
