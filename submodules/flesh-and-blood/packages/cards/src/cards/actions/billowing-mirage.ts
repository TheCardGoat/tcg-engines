import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/billowing-mirage.generated.ts";

import { goAgain } from "../shared/keywords.ts";

const abilities = {
  onAttackStatic: {
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
            name: "Billowing Mirage",
          },
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "transform",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent"],
          filter: {
            name: "Ash",
          },
          count: {
            type: "up-to",
            amount: 1,
          },
        },
        into: "aether-ashwing",
      },
    },
    label: {
      name: "transform",
    },
  },
} as const;

export const billowingMirage = definePitchFamily(fabPitchFamilies["billowing-mirage"], {
  keywords: [goAgain],
  abilities: () => ({ ...abilities }),
});

export const {
  red: billowingMirageRed,
  yellow: billowingMirageYellow,
  blue: billowingMirageBlue,
} = billowingMirage.cards;
