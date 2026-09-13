import { ward } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/meridian-pathway.generated.ts";

export const meridianPathway = defineCard(fabCardIdentitiesByCanonicalId["GgRFLW8zdKbNJtgfFTFkp"], {
  keywords: [ward(3)],
  abilities: {
    instantMayPlayAurasTurnAsThoughTheyWere: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "asset",
        type: "chi",
        amount: 3,
      },
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          fromZones: ["hand"],
          source: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["hand"],
            filter: {
              typeBox: {
                subtypes: ["Aura"],
              },
            },
            count: {
              type: "all",
            },
          },
          duration: "this-turn",
          asType: "instant",
        },
      },
    },
    wheneverPitchChiMayHaveGetWard3Until: {
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
              typeBox: {
                subtypes: ["Chi"],
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
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: ward(3),
            },
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
        },
      },
    },
  },
});
