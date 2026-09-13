import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/absorption-dome.generated.ts";

export const absorptionDome = definePitchFamily(fabPitchFamilies["absorption-dome"], {
  abilities: () => ({
    absorptionDomeEntersArenaSteamCountersEqualNumberTimes: {
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
          count: {
            type: "count",
            what: "boosts-this-combat-chain",
          },
          target: {
            selector: "self",
          },
        },
        duration: "while-in-arena",
      },
    },
    ifHeroWouldBeDealtDamageRemoveManySteam: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "prevention",
        preventionKind: "shielding",
        shielded: {
          selector: "controller",
        },
        duration: "while-in-arena",
        amount: {
          type: "count",
          what: "counters-removed",
        },
        additionalModification: {
          type: "remove-counters",
          counter: {
            kind: "named",
            name: "steam",
          },
          count: {
            type: "event-amount",
          },
          target: {
            selector: "self",
          },
        },
      },
    },
    whenAbsorptionDomeHasNoSteamCountersDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "state",
        state: {
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
            value: 0,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
  }),
});
export const { yellow: absorptionDomeYellow } = absorptionDome.cards;
