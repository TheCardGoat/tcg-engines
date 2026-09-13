import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/helm-of-halo-s-grace.generated.ts";

export const helmOfHaloSGrace = defineCard(
  fabCardIdentitiesByCanonicalId["TKbBnD6hMmqHfhDPtmHjL"],
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
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["hand"],
                    count: 1,
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
                  type: "draw",
                  count: 1,
                  player: "controller",
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
