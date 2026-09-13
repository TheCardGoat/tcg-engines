import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/companion-of-the-claw.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const companionOfTheClaw = definePitchFamily(fabPitchFamilies["companion-of-the-claw"], {
  keywords: [goAgain],
  abilities: () => ({
    staticTriggeredAttackAttackCreateTokenCrouchingTiger: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
        state: {
          type: "pitch-zone-has",
          filter: {
            color: ["blue"],
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "crouching-tiger",
          controller: "controller",
          to: {
            zone: "hand",
          },
        },
      },
    },
  }),
});

export const {
  red: companionOfTheClawRed,
  yellow: companionOfTheClawYellow,
  blue: companionOfTheClawBlue,
} = companionOfTheClaw.cards;
