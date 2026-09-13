import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/flash-of-brilliance.generated.ts";

export const flashOfBrilliance = defineCard(
  fabCardIdentitiesByCanonicalId["hBDtCDkPFDtWFTm9hGJDq"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenDefendsMayDiscardLightningIfDoReturnAura: {
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
                  typeBox: {
                    supertypes: ["Lightning"],
                  },
                },
                count: 1,
              },
            },
            then: {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["permanent"],
                filter: {
                  typeBox: {
                    subtypes: ["Aura"],
                  },
                },
                count: 1,
              },
              to: {
                zone: "hand",
              },
            },
          },
        },
      },
    },
  },
);
