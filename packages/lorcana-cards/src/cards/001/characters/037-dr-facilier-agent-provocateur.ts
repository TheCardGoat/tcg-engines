import type { CharacterCard } from "@tcg/lorcana-types";
import { moveCards, optional } from "../../ability-helpers";

export const drFacilierAgentProvocateur: CharacterCard = {
  id: "pyt",
  cardType: "character",
  name: "Dr. Facilier",
  version: "Agent Provocateur",
  fullName: "Dr. Facilier - Agent Provocateur",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Dr. Facilier.)_\n\n**INTO THE SHADOWS** Whenever one of your other characters is banished in a challenge, you may return that card to your hand.",
  cost: 7,
  strength: 4,
  willpower: 5,
  lore: 3,
  cardNumber: 37,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "c3l-1",
      text: "**SLEIGHT OF HAND** When you play this character, you may return target character to their player's hand.",
      effect: optional(
        moveCards("play", "hand", {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["card"],
          },
        }),
      ),
    },
  ],
  classifications: ["Floodborn", "Sorcerer", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverOneOfYourCharactersIsBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const drFacilierAgentProvocateur: LorcanitoCharacterCard = {
//   id: "pyt",
//
//   name: "Dr. Facilier",
//   title: "Agent Provocateur",
//   characteristics: ["floodborn", "sorcerer", "villain"],
//   text: "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Dr. Facilier.)_\n\n**INTO THE SHADOWS** Whenever one of your other characters is banished in a challenge, you may return that card to your hand.",
//   type: "character",
//   abilities: [
//     wheneverOneOfYourCharactersIsBanishedInAChallenge({
//       name: "Into the Shadows",
//       text: "Whenever one of your other characters is banished in a challenge, you may return that card to your hand.",
//       optional: true,
//       triggerFilter: [
//         { filter: "owner", value: "self" },
//         { filter: "type", value: "character" },
//         { filter: "source", value: "other" },
//       ],
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "source", value: "trigger" }],
//           },
//         },
//       ],
//     }),
//     shiftAbility(5, "Dr. Facilier"),
//   ],
//   colors: ["amethyst"],
//   cost: 7,
//   strength: 4,
//   willpower: 5,
//   lore: 3,
//   illustrator: "Isaiah Mesq",
//   number: 37,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508723,
//   },
//   rarity: "rare",
// };
//
