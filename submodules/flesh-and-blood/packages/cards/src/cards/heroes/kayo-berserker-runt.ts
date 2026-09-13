import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/kayo-berserker-runt.generated.ts";

export const kayoBerserkerRunt = defineCard(
  fabCardIdentitiesByCanonicalId["NcQMQ79gb9P7CTMfWfBz8"],
  {
    abilities: {
      wheneverPlayAttackActionBasePower6MorePowerRoll6SidedDie14HalveAttacksBasePowerRoundedDown56DoubleAttacksBasePower:
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "play",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "event-object",
                selector: "played-card",
                relationship: {
                  kind: "any",
                },
                filter: attackActionFilter({ power: { op: "gte", value: 6 } }),
                bindAs: "it",
              },
            },
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "roll",
                  sides: 6,
                },
                {
                  // On 1 to 4: half base power, rounded down.
                  type: "conditional",
                  condition: {
                    type: "die-result",
                    comparison: { op: "lte", value: 4 },
                  },
                  then: {
                    type: "modify-numeric",
                    property: "power",
                    op: "divide",
                    amount: 2,
                    rounding: "down",
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                    duration: "this-turn",
                  },
                },
                {
                  // On 5 or 6: double base power.
                  type: "conditional",
                  condition: {
                    type: "or",
                    conditions: [
                      { type: "die-result", comparison: { op: "eq", value: 5 } },
                      { type: "die-result", comparison: { op: "eq", value: 6 } },
                    ],
                  },
                  then: {
                    type: "modify-numeric",
                    property: "power",
                    op: "multiply",
                    amount: 2,
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                    duration: "this-turn",
                  },
                },
              ],
            },
          },
        },
    },
  },
);
