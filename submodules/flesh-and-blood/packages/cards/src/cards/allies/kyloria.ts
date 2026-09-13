import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/allies/kyloria.generated.ts";

export const kyloria = defineCard(fabCardIdentitiesByCanonicalId.PHgMJBpk9fJcWNrrnqztz, {
  abilities: {
    stealItemOrDrawOnHit: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "unless",
          effect: {
            type: "draw",
            count: 1,
            player: "controller",
          },
          escape: {
            type: "gain-control",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Item"],
                },
              },
              count: 1,
            },
            controller: "controller",
          },
        },
      },
    },
  },
});
