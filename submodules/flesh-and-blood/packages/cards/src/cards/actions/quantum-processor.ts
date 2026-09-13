import { crank } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/quantum-processor.generated.ts";

export const quantumProcessor = definePitchFamily(fabPitchFamilies["quantum-processor"], {
  keywords: [crank],
  abilities: () => ({
    entersArenaSteamCounter: {
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
    startTurnDestroyUnlessRemoveSteamCounter: {
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
            count: 1,
            target: {
              selector: "self",
            },
          },
        },
      },
    },
    oncePerTurnInstant0PutMechanologistItemCost01HandArena: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "instant",
      cost: {
        class: "asset",
        type: "resources",
        amount: 0,
      },
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["hand"],
          filter: {
            typeBox: {
              subtypes: ["Item"],
              supertypes: ["Mechanologist"],
            },
            cost: {
              op: "lte",
              value: 1,
            },
          },
          count: 1,
        },
        to: {
          zone: "permanent",
        },
      },
    },
  }),
});

export const { yellow: quantumProcessorYellow } = quantumProcessor.cards;
