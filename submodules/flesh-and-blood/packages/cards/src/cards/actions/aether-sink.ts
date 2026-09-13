import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/aether-sink.generated.ts";

import { arcaneBarrier, goAgain } from "../shared/keywords.ts";

export const aetherSink = definePitchFamily(fabPitchFamilies["aether-sink"], {
  abilities: () => ({
    aetherSinkEntersArenaSteamCounter: {
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
          count: 1,
          target: {
            selector: "self",
          },
        },
        duration: "while-in-arena",
      },
    },
    actionIfThereAreNoSteamCountersAetherSink: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
      layerKeywords: [goAgain],
      effect: {
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
            value: 0,
          },
        },
        then: {
          type: "add-counter",
          counter: {
            kind: "named",
            name: "steam",
          },
          count: 1,
          target: {
            selector: "self",
          },
        },
      },
    },
    instantRemoveSteamCounterFromAetherSinkAetherSink: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "remove-counters",
        counter: {
          kind: "named",
          name: "steam",
        },
        count: 1,
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: arcaneBarrier(2),
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { yellow: aetherSinkYellow } = aetherSink.cards;
