import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/harmony-of-the-hunt.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const harmonyOfTheHunt = definePitchFamily(fabPitchFamilies["harmony-of-the-hunt"], {
  keywords: [goAgain],
  abilities: () => ({
    triggeredAttackPitchZoneHasCreateTokenCrouchingTiger: {
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
  red: harmonyOfTheHuntRed,
  yellow: harmonyOfTheHuntYellow,
  blue: harmonyOfTheHuntBlue,
} = harmonyOfTheHunt.cards;
