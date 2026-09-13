import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/trap-and-release.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const trapAndRelease = definePitchFamily(fabPitchFamilies["trap-and-release"], {
  keywords: [goAgain],
  abilities: () => ({
    triggeredStaticOnHitEffect: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "mark",
          target: {
            selector: "attack-target",
          },
        },
      },
      label: {
        name: "mark",
      },
    },
  }),
});

export const {
  red: trapAndReleaseRed,
  yellow: trapAndReleaseYellow,
  blue: trapAndReleaseBlue,
} = trapAndRelease.cards;
