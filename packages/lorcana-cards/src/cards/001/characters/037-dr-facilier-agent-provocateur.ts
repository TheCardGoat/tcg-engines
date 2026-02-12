import type { CharacterCard } from "@tcg/lorcana-types";

export const drFacilierAgentProvocateur: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["card"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "c3l-1",
      text: "**SLEIGHT OF HAND** When you play this character, you may return target character to their player's hand.",
      type: "action",
    },
  ],
  cardNumber: 37,
  cardType: "character",
  classifications: ["Floodborn", "Sorcerer", "Villain"],
  cost: 7,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Dr. Facilier - Agent Provocateur",
  id: "pyt",
  inkType: ["amethyst"],
  inkable: true,
  lore: 3,
  name: "Dr. Facilier",
  set: "001",
  strength: 4,
  text: "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Dr. Facilier.)_\n\n**INTO THE SHADOWS** Whenever one of your other characters is banished in a challenge, you may return that card to your hand.",
  version: "Agent Provocateur",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { wheneverOneOfYourCharactersIsBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const drFacilierAgentProvocateur: LorcanitoCharacterCard = {
//   Id: "pyt",
//
//   Name: "Dr. Facilier",
//   Title: "Agent Provocateur",
//   Characteristics: ["floodborn", "sorcerer", "villain"],
//   Text: "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Dr. Facilier.)_\n\n**INTO THE SHADOWS** Whenever one of your other characters is banished in a challenge, you may return that card to your hand.",
//   Type: "character",
//   Abilities: [
//     WheneverOneOfYourCharactersIsBanishedInAChallenge({
//       Name: "Into the Shadows",
//       Text: "Whenever one of your other characters is banished in a challenge, you may return that card to your hand.",
//       Optional: true,
//       TriggerFilter: [
//         { filter: "owner", value: "self" },
//         { filter: "type", value: "character" },
//         { filter: "source", value: "other" },
//       ],
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [{ filter: "source", value: "trigger" }],
//           },
//         },
//       ],
//     }),
//     ShiftAbility(5, "Dr. Facilier"),
//   ],
//   Colors: ["amethyst"],
//   Cost: 7,
//   Strength: 4,
//   Willpower: 5,
//   Lore: 3,
//   Illustrator: "Isaiah Mesq",
//   Number: 37,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508723,
//   },
//   Rarity: "rare",
// };
//
