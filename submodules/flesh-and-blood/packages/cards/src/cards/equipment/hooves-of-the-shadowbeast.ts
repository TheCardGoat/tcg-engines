import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/hooves-of-the-shadowbeast.generated.ts";

export const hoovesOfTheShadowbeast = defineCard(
  fabCardIdentitiesByCanonicalId["khP7tT6NRCgzjJMWB8JHm"],
  {
    keywords: [battleworn],
    abilities: {
      whenever6MoreIsPutIntoBanishedZoneMay: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "banish",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "moved-object",
              relationship: {
                kind: "owner",
                player: "ability-controller",
              },
              filter: {
                power: {
                  op: "gte",
                  value: 6,
                },
              },
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            then: {
              type: "gain-action-points",
              amount: 1,
            },
          },
        },
      },
    },
  },
);
