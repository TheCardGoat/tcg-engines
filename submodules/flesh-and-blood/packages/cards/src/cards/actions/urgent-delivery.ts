import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/urgent-delivery.generated.ts";

export const urgentDelivery = definePitchFamily(fabPitchFamilies["urgent-delivery"], {
  abilities: () => ({
    triggeredStaticOnHitEffect: {
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
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              filter: {
                and: [
                  {
                    typeBox: {
                      supertypes: ["Mechanologist"],
                    },
                  },
                  {
                    typeBox: {
                      subtypes: ["Item"],
                    },
                  },
                ],
                cost: {
                  op: "lte",
                  value: {
                    type: "count",
                    what: "boosts-this-combat-chain",
                  },
                },
              },
              count: 1,
            },
            to: {
              zone: "permanent",
            },
          },
        },
      },
    },
  }),
});

export const {
  red: urgentDeliveryRed,
  yellow: urgentDeliveryYellow,
  blue: urgentDeliveryBlue,
} = urgentDelivery.cards;
