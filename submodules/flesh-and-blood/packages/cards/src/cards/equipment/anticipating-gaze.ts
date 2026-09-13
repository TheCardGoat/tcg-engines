import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/anticipating-gaze.generated.ts";

export const anticipatingGaze = defineCard(
  fabCardIdentitiesByCanonicalId["b8JRFt6dF7JckNz8N6kDN"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenSwordAttackControlHitsMayRemove1Counter: {
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
              filter: {
                typeBox: {
                  subtypes: ["Sword"],
                },
              },
              bindAs: "it",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "remove-counters",
              counter: {
                kind: "numeric",
                value: 1,
                property: "power",
              },
              count: 1,
              target: {
                selector: "binding",
                binding: "it",
              },
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "destroy",
                  target: {
                    selector: "self",
                  },
                },
                {
                  type: "draw",
                  count: 1,
                  player: "controller",
                },
              ],
            },
          },
        },
      },
    },
  },
);
