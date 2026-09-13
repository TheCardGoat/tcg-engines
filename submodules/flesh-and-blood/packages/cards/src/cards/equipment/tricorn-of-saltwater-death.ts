import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/tricorn-of-saltwater-death.generated.ts";

export const tricornOfSaltwaterDeath = defineCard(
  fabCardIdentitiesByCanonicalId["hBqjdnFmnpdFC8wpQGgfB"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenDefendsMayDiscardWateryGraveIfDoDraw: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "defend",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "source",
              selector: "defender",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "discard",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                filter: {
                  hasKeyword: "watery-grave",
                },
                count: 1,
              },
              outputBinding: "it",
            },
            then: {
              type: "draw",
              count: 1,
              player: "controller",
            },
          },
        },
      },
    },
  },
);
