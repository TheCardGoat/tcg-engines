import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/warpath-of-winged-grace.generated.ts";

export const warpathOfWingedGrace = defineCard(
  fabCardIdentitiesByCanonicalId["rdKrHRBf66GR7WdzL8dpN"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenDefendsMayChargeHeroSSoulIfYellow: {
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
            type: "sequence",
            steps: [
              {
                type: "optional",
                effect: {
                  type: "charge",
                  target: {
                    selector: "controller",
                  },
                },
              },
              {
                type: "conditional",
                condition: {
                  type: "binding-matches",
                  binding: "chargedCard",
                  filter: { color: ["yellow"] },
                },
                then: {
                  type: "create-token",
                  token: "quicken",
                  controller: "controller",
                },
              },
            ],
          },
        },
        label: {
          name: "charge",
        },
      },
    },
  },
);
