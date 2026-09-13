import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/dissolving-shield.generated.ts";
import { crank } from "../shared/keywords.ts";
export const dissolvingShield = definePitchFamily(fabPitchFamilies["dissolving-shield"], {
  parameters: pitchMap({
    red: { value1: 3, value2: 1, value3: 1, value4: 1, value5: 0 },
    yellow: { value1: 2, value2: 1, value3: 1, value4: 1, value5: 0 },
    blue: { value1: 1, value2: 1, value3: 1, value4: 1, value5: 0 },
  }),
  keywords: [crank],
  abilities: ({ value1, value2, value3, value4, value5 }) => ({
    staticContinuousReplacementAddCounter: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "enter-arena",
          subject: "self",
        },
        modification: {
          type: "add-counter",
          counter: {
            kind: "named",
            name: "steam",
          },
          count: value1,
          target: {
            selector: "self",
          },
        },
        duration: "while-in-arena",
      },
    },
    staticTriggeredStartPhaseUnlessDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "unless",
          effect: {
            type: "destroy",
            target: {
              selector: "self",
            },
          },
          escape: {
            type: "remove-counters",
            counter: {
              kind: "named",
              name: "steam",
            },
            count: value2,
            target: {
              selector: "self",
            },
          },
        },
      },
    },
    activatedInstantSequence: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "remove-counters",
        counter: {
          kind: "named",
          name: "steam",
        },
        count: value3,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "prevention",
            preventionKind: "fixed",
            amount: value4,
            shielded: {
              selector: "controller",
            },
            duration: "this-turn",
          },
          {
            type: "conditional",
            condition: {
              type: "has-counter",
              counter: {
                kind: "named",
                name: "steam",
              },
              target: {
                selector: "self",
              },
              comparison: {
                op: "eq",
                value: value5,
              },
            },
            then: {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
          },
        ],
      },
    },
  }),
});
export const {
  red: dissolvingShieldRed,
  yellow: dissolvingShieldYellow,
  blue: dissolvingShieldBlue,
} = dissolvingShield.cards;
