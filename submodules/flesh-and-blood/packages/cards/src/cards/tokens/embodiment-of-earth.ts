import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/embodiment-of-earth.generated.ts";

export const embodimentOfEarth = defineCard(fabCardIdentitiesByCanonicalId.jrcdWNnMQCtrjQqKjd9Fw, {
  abilities: {
    increaseNonAttackActionDefense: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent", "combat-chain"],
          filter: {
            typeBox: {
              types: ["Action"],
              excludeSubtypes: ["Attack"],
            },
            defending: true,
          },
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
    },
    destroyAtActionPhase: {
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
  },
});
