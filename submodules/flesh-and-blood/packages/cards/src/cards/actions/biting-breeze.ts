import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/biting-breeze.generated.ts";

import { goAgain } from "../shared/keywords.ts";

const abilities = {
  onHitCreateTokenCrouchingTiger: {
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
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "create-token",
            token: "crouching-tiger",
            controller: "controller",
            to: {
              zone: "banished",
            },
            outputBinding: "it",
          },
          {
            type: "optional",
            effect: {
              type: "play-card",
              fromZones: ["banished"],
              source: {
                selector: "binding",
                binding: "it",
              },
              duration: "this-turn",
            },
          },
        ],
      },
    },
  },
} as const;

export const bitingBreeze = definePitchFamily(fabPitchFamilies["biting-breeze"], {
  keywords: [goAgain],
  abilities: () => ({ ...abilities }),
});

export const {
  red: bitingBreezeRed,
  yellow: bitingBreezeYellow,
  blue: bitingBreezeBlue,
} = bitingBreeze.cards;
