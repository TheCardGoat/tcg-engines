import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/runechant-of-pride.generated.ts";

export const runechantOfPride = definePitchFamily(fabPitchFamilies["runechant-of-pride"], {
  abilities: () => ({
    countsAsRunechant: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "name",
          value: "Runechant",
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
    whenAttackUsurpsGets1: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "usurp",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "binding",
            binding: "attack",
          },
          duration: "this-turn",
        },
      },
    },
    whenIsDestroyedCreateRunechantToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "destroy",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "runechant",
          controller: "controller",
        },
      },
    },
    destroyAtActionPhaseStart: {
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
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
    destroyWhenAttackActionPlayed: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "played-card",
            relationship: {
              kind: "any",
            },
            filter: attackActionFilter(),
            bindAs: "it",
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

export const { yellow: runechantOfPrideYellow } = runechantOfPride.cards;
