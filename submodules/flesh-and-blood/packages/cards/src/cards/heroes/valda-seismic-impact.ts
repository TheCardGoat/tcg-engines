import { grantKeyword } from "@tcg/flesh-and-blood-types";
import { dominate } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/valda-seismic-impact.generated.ts";

export const valdaSeismicImpact = defineCard(
  fabCardIdentitiesByCanonicalId["bjLbTMgMm6QRWBRrw8chQ"],
  {
    abilities: {
      wheneverOpponentDraws1MoreDuringActionPhaseCreateManySeismicSurgeTokens: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "draw",
            actor: {
              kind: "player",
              player: "opponent",
            },
            observes: {
              kind: "none",
            },
            during: {
              kind: "phase",
              phase: "action",
            },
            amount: {
              op: "gte",
              value: 1,
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "create-token",
            token: "seismic-surge",
            controller: "controller",
            count: {
              type: "event-amount",
            },
          },
        },
      },
      startTurn3MoreSeismicSurgeTokensCrushGetDominateTurn: {
        kind: "static",
        staticKind: "triggered",
        // Source print has "Siesmic" typo; token name is Seismic Surge.
        trigger: {
          kind: "event-and-state",
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
          state: {
            type: "zone-count",
            zone: "permanent",
            player: "controller",
            filter: {
              name: "Seismic Surge",
              typeBox: {
                metatypes: ["Token"],
              },
            },
            comparison: {
              op: "gte",
              value: 3,
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: grantKeyword(dominate, {
            appliesTo: {
              next: { hasLabel: "crush" },
              count: { type: "all" },
              events: ["play", "attack"],
            },
          }),
        },
      },
    },
  },
);
