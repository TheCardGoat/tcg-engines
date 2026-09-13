import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/mask-of-the-pouncing-lynx.generated.ts";

export const maskOfThePouncingLynx = defineCard(
  fabCardIdentitiesByCanonicalId["GBDFTmjdTmgRCdHngGWNR"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenAttackActionControlHitsMayDestroyMaskPouncing: {
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
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
              filter: attackActionFilter(),
              bindAs: "it",
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
              type: "sequence",
              steps: [
                {
                  type: "search",
                  zones: ["deck"],
                  filter: attackActionFilter({
                    power: {
                      op: "lte",
                      value: 2,
                    },
                  }),
                  mayFail: true,
                  to: {
                    zone: "banished",
                  },
                  outputBinding: "it",
                },
                {
                  type: "shuffle",
                  zone: "deck",
                },
                {
                  type: "play-card",
                  fromZones: ["banished"],
                  source: {
                    selector: "binding",
                    binding: "it",
                  },
                  duration: "this-turn",
                },
              ],
            },
          },
        },
      },
    },
  },
);
