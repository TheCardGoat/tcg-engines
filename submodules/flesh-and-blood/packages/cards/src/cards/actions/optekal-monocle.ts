import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/optekal-monocle.generated.ts";

export const optekalMonocle = definePitchFamily(fabPitchFamilies["optekal-monocle"], {
  abilities: () => ({
    optekalMonocleEntersArena5SteamCounters: {
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
          count: 5,
          target: {
            selector: "self",
          },
        },
        duration: "while-in-arena",
      },
    },
    optekalMonocleNoSteamCountersDestroy: {
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
    actionRemoveSteamCounterOptekalMonocleOpt1GoAgain: {
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
        type: "opt",
        count: 1,
      },
    },
  }),
});

export const { blue: optekalMonocleBlue } = optekalMonocle.cards;
