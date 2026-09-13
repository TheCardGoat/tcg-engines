import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/be-like-water.generated.ts";

import { goAgain } from "../shared/keywords.ts";

const abilities = {
  onHitPayGrantProperty: {
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
        type: "optional",
        effect: {
          type: "pay",
          cost: {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          payer: "controller",
        },
        then: {
          type: "sequence",
          steps: [
            {
              type: "choose-option",
              options: ["Head Jab", "Surging Strike", "Twin Twisters"],
              chooser: "controller",
            },
            {
              type: "grant-property",
              property: {
                kind: "name",
                value: "chosen",
              },
              target: {
                selector: "self",
              },
              duration: "this-combat-chain",
            },
          ],
        },
      },
    },
  },
} as const;

export const beLikeWater = definePitchFamily(fabPitchFamilies["be-like-water"], {
  keywords: [goAgain],
  abilities: () => ({ ...abilities }),
});

export const {
  red: beLikeWaterRed,
  yellow: beLikeWaterYellow,
  blue: beLikeWaterBlue,
} = beLikeWater.cards;
