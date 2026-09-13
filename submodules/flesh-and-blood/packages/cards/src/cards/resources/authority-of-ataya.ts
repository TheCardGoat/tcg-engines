import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/resources/authority-of-ataya.generated.ts";
import { legendary } from "../shared/keywords.ts";

export const authorityOfAtayaBlue = defineCard(
  fabCardIdentitiesByCanonicalId.Wkg8Fp6Wg7Cnb8rzHGqFh,
  {
    keywords: [legendary],
    abilities: {
      increaseOpponentDefenseReactionCosts: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "pitch",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "none",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "modify-numeric",
            property: "cost",
            op: "add",
            amount: 1,
            target: {
              selector: "opponent",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  types: ["Defense Reaction"],
                },
              },
              count: {
                type: "all",
              },
            },
          },
        },
      },
    },
  },
);
