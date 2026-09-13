import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/preach-modesty.generated.ts";

export const preachModesty = definePitchFamily(fabPitchFamilies["preach-modesty"], {
  abilities: () => ({
    entersArenaBalanceCounter: {
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
            name: "balance",
          },
          count: 1,
          target: {
            selector: "self",
          },
        },
        duration: "while-in-arena",
      },
    },
    beginningActionPhaseDestroyUnlessRemoveBalanceCounter: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
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
              name: "balance",
            },
            count: 1,
            target: {
              selector: "self",
            },
          },
        },
      },
    },
    abilitiesCantCreate: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "create",
        subject: {
          typeBox: {
            types: ["Hero"],
          },
        },
        duration: "while-in-arena",
      },
    },
  }),
});

export const { red: preachModestyRed } = preachModesty.cards;
