import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/become-the-bottle.generated.ts";

import { goAgain } from "../shared/keywords.ts";

const abilities = {
  onAttackGrantProperty: {
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
            type: "choose-card",
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              count: 1,
            },
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
} as const;

export const becomeTheBottle = definePitchFamily(fabPitchFamilies["become-the-bottle"], {
  keywords: [goAgain],
  abilities: () => ({ ...abilities }),
});

export const {
  red: becomeTheBottleRed,
  yellow: becomeTheBottleYellow,
  blue: becomeTheBottleBlue,
} = becomeTheBottle.cards;
