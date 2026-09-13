import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/dromai-ash-artist.generated.ts";

export const dromaiAshArtist = defineCard(fabCardIdentitiesByCanonicalId["PrJkWBKNgtNdzhqhWLGFw"], {
  abilities: {
    wheneverPitchRedCreateAshToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "pitch",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "pitched-card",
            relationship: {
              kind: "any",
            },
            filter: {
              color: ["red"],
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "ash",
          controller: "controller",
        },
      },
    },
    playedRedTurnDragonsGoAgainAttacking: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "played-this",
        per: "turn",
        filter: {
          color: ["red"],
        },
        comparison: {
          op: "gte",
          value: 1,
        },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              subtypes: ["Dragon"],
            },
            hasStatus: "attacking",
          },
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
    },
  },
});
