import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/signal-jammer.generated.ts";

export const signalJammer = definePitchFamily(fabPitchFamilies["signal-jammer"], {
  abilities: () => ({
    signalJammerEntersArenaWithSteamCounterOn: {
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
    atBeginningActionPhaseDestroySignalJammerUnlessRemoveSteamCounterFrom: {
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
              name: "steam",
            },
            count: 1,
            target: {
              selector: "self",
            },
          },
        },
      },
    },
    eachHeroCanTPlayMoreThanNumber1NonAttackActionEach: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "play",
        filter: {
          typeBox: {
            types: ["Action"],
            excludeSubtypes: ["Attack"],
          },
        },
        limit: {
          count: 1,
        },
        duration: "while-in-arena",
      },
    },
  }),
});

export const { blue: signalJammerBlue } = signalJammer.cards;
