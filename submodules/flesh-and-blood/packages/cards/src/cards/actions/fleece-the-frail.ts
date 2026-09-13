import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/fleece-the-frail.generated.ts";
const abilities = {
  establishContract: {
    kind: "resolution",
    effect: {
      type: "contract-task",
      task: "banish opponents' cards with 2 or less {d}",
      completeOn: "banish",
      filter: {
        defense: {
          op: "lte",
          value: 2,
        },
      },
    },
    label: {
      name: "contract",
    },
  },
  createSilverOnContractCompletion: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "complete-contract",
        actor: {
          kind: "any",
        },
        observes: {
          kind: "none",
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "create-token",
        token: "silver",
        controller: "controller",
      },
    },
    label: {
      name: "contract",
    },
  },
  onHitBanish: {
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
        type: "banish",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["deck"],
          position: "top",
          count: 1,
        },
        outputBinding: "banished",
      },
    },
  },
} as const;
export const fleeceTheFrail = definePitchFamily(fabPitchFamilies["fleece-the-frail"], {
  abilities: () => ({ ...abilities }),
});
export const {
  red: fleeceTheFrailRed,
  yellow: fleeceTheFrailYellow,
  blue: fleeceTheFrailBlue,
} = fleeceTheFrail.cards;
