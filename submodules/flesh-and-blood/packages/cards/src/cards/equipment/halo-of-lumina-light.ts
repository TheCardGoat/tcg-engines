import { spellvoid } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/halo-of-lumina-light.generated.ts";

export const haloOfLuminaLight = defineCard(
  fabCardIdentitiesByCanonicalId["ghPKp8NCBqQNbKLGpqkGM"],
  {
    keywords: [spellvoid(2)],
    abilities: {
      whenIsDestroyedMayPutYellowAuraFromBanished: {
        kind: "static",
        staticKind: "triggered",
        functionalZones: ["equipment-head", "graveyard"],
        trigger: {
          kind: "event",
          event: {
            name: "destroy",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "source",
              selector: "moved-object",
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
                zones: ["banished"],
                filter: {
                  color: ["yellow"],
                  typeBox: {
                    subtypes: ["Aura"],
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
    },
  },
);
