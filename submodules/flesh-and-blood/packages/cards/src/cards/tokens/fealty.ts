import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/fealty.generated.ts";

export const fealty = defineCard(fabCardIdentitiesByCanonicalId.n9FtLHDg97rfrTNJDMBG6, {
  abilities: {
    makeNextCardDraconic: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "supertype",
          value: "Draconic",
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
        appliesTo: {
          next: {},
          events: ["play"],
        },
      },
    },
    destroyAtEndPhaseIfInactive: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "end-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "not",
          condition: {
            type: "or",
            conditions: [
              {
                type: "performed-this-turn",
                event: "create-fealty-token",
                player: "controller",
              },
              {
                type: "performed-this-turn",
                event: "play-draconic-card",
                player: "controller",
              },
            ],
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
