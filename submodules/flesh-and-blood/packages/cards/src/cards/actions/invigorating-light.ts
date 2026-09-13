import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/invigorating-light.generated.ts";

const abilities = {
  triggeredPlayInvigoratingLightZoneCountDelayedTriggerCombatChainCloseThisCombatChainMoveCard: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event-and-state",
      event: {
        name: "play",
        actor: {
          kind: "player",
          player: "ability-controller",
        },
        observes: {
          kind: "event-object",
          selector: "played-card",
          bindAs: "it",
          relationship: {
            kind: "any",
          },
          filter: {
            name: "Invigorating Light",
          },
        },
      },
      state: {
        type: "zone-count",
        zone: "soul",
        player: "controller",
        comparison: {
          op: "eq",
          value: 0,
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "combat-chain-close",
            actor: {
              kind: "none",
            },
            observes: {
              kind: "none",
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-combat-chain",
          matching: "first",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "move-card",
            target: {
              selector: "binding",
              binding: "it",
            },
            to: {
              zone: "soul",
            },
          },
        },
      },
    },
  },
} as const;

export const invigoratingLight = definePitchFamily(fabPitchFamilies["invigorating-light"], {
  abilities: () => ({ ...abilities }),
});

export const {
  red: invigoratingLightRed,
  yellow: invigoratingLightYellow,
  blue: invigoratingLightBlue,
} = invigoratingLight.cards;
