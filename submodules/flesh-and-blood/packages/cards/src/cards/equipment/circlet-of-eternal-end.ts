import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/circlet-of-eternal-end.generated.ts";

export const circletOfEternalEnd = defineCard(
  fabCardIdentitiesByCanonicalId["GPGfcbccKmqwfKtGPfbRM"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenDefendsTurnAttackingHeroSBanishedZoneFace: {
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
            type: "turn-face-down",
            target: {
              // Printed "attacking hero" — in 1v1 product that is the sole opponent
              // of the defending controller.
              selector: "object",
              declared: "on-stack",
              player: "opponent",
              zones: ["banished"],
              count: 1,
            },
          },
        },
      },
    },
  },
);
