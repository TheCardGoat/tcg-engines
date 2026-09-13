import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/events/air-of-a-comeback.generated.ts";

export const airOfAComeback = defineCard(fabCardIdentitiesByCanonicalId.BcJhMTnwWRcdhGHMCpr8H, {
  abilities: {
    recoverNonAttackAction: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "optional",
            effect: {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["graveyard"],
                filter: {
                  typeBox: {
                    types: ["Action"],
                    excludeSubtypes: ["Attack"],
                  },
                },
                count: 1,
              },
              to: {
                zone: "deck",
                position: "top",
              },
            },
          },
          {
            type: "self-replacement",
            condition: {
              type: "zone-count",
              zone: "hand",
              player: "controller",
              comparison: {
                op: "eq",
                value: 0,
              },
            },
            modification: {
              type: "optional",
              effect: {
                type: "play-card",
                fromZones: ["graveyard"],
                source: {
                  selector: "binding",
                  binding: "it",
                },
                costModification: "free",
                duration: "this-turn",
              },
            },
          },
        ],
      },
    },
  },
});
