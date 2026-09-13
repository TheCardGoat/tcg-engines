import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/boom-grenade.generated.ts";

import { crank } from "../shared/keywords.ts";

export const boomGrenade = definePitchFamily(fabPitchFamilies["boom-grenade"], {
  parameters: pitchMap({
    red: { value1: 1, value2: 1, value3: 4 },
    yellow: { value1: 1, value2: 1, value3: 3 },
    blue: { value1: 1, value2: 1, value3: 2 },
  }),
  keywords: [crank],
  abilities: ({ value1, value2, value3 }) => ({
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
    staticTriggeredStartPhaseStartPhaseUnlessDestroy: {
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
    staticTriggeredHitHitSequence: {
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
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                supertypes: ["Mechanologist"],
                types: ["Action"],
                subtypes: ["Attack"],
              },
            },
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "deal-damage",
              damageType: "generic",
              amount: value3,
              target: {
                selector: "attack-target",
              },
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: boomGrenadeRed,
  yellow: boomGrenadeYellow,
  blue: boomGrenadeBlue,
} = boomGrenade.cards;
