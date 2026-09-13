import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/aurora-shooting-star.generated.ts";

export const auroraShootingStar = defineCard(
  fabCardIdentitiesByCanonicalId["mHBtPppktRTkWpnf69dHj"],
  {
    keywords: [
      {
        name: "essence",
        supertypes: ["Lightning"],
      },
    ],
    abilities: {
      oncePerTurnInstantResourceResourceCreateEmbodimentLightningTokenActivateOnlyPlayedLightningTurn:
        {
          kind: "activated",
          limit: {
            count: 1,
            per: "turn",
          },
          abilityType: "instant",
          cost: {
            class: "asset",
            type: "resources",
            amount: 2,
          },
          condition: {
            type: "played-this",
            per: "turn",
            filter: {
              typeBox: {
                supertypes: ["Lightning"],
              },
            },
            comparison: {
              op: "gte",
              value: 1,
            },
          },
          effect: {
            type: "create-token",
            token: "embodiment-of-lightning",
            controller: "controller",
          },
        },
    },
  },
);
