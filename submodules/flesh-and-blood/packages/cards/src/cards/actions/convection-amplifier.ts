import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/convection-amplifier.generated.ts";

import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";

import { dominate, goAgain } from "../shared/keywords.ts";

export const convectionAmplifier = definePitchFamily(fabPitchFamilies["convection-amplifier"], {
  abilities: () => ({
    convectionAmplifierEntersArena2SteamCounters: {
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
          count: 2,
          target: {
            selector: "self",
          },
        },
        duration: "while-in-arena",
      },
    },
    whenConvectionAmplifierHasNoSteamCountersDestroy: {
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
    actionRemoveSteamCounterFromConvectionAmplifierNextAttack: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "remove-counters",
        counter: {
          kind: "named",
          name: "steam",
        },
        count: 1,
      },
      layerKeywords: [goAgain],
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: dominate,
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: nextAttackActionLatch(),
      },
    },
  }),
});
export const { red: convectionAmplifierRed } = convectionAmplifier.cards;
