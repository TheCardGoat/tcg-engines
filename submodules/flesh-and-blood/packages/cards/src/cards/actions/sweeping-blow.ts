import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sweeping-blow.generated.ts";
import { goAgain } from "../shared/keywords.ts";

const abilities = {
  triggeredEffect: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "attack",
        actor: {
          kind: "player",
          player: "ability-controller",
        },
        observes: {
          kind: "event-object",
          selector: "attack",
          relationship: {
            kind: "any",
          },
          filter: {
            name: "Sweeping Blow",
          },
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "create-token",
        token: "ash",
        controller: "controller",
      },
    },
  },
} as const;

export const sweepingBlow = definePitchFamily(fabPitchFamilies["sweeping-blow"], {
  keywords: [goAgain],
  abilities: () => abilities,
});

export const {
  red: sweepingBlowRed,
  yellow: sweepingBlowYellow,
  blue: sweepingBlowBlue,
} = sweepingBlow.cards;
