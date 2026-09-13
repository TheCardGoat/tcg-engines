import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/volzar-meteor-storm.generated.ts";

export const volzarMeteorStorm = defineCard(
  fabCardIdentitiesByCanonicalId["zfTFn8L8fMNW9bmRcn8Lw"],
  {
    abilities: {
      instantTapAmp1ActivateOnlyInstantPutGraveyardTurn: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "tap-self",
        },
        condition: {
          type: "zone-count",
          zone: "graveyard",
          player: "controller",
          filter: {
            typeBox: {
              types: ["Instant"],
            },
          },
          comparison: {
            op: "gte",
            value: 1,
          },
          per: "turn",
        },
        effect: {
          type: "amp",
          amount: 1,
        },
      },
    },
  },
);
