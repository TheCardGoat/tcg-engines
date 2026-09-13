import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/smashing-performance.generated.ts";

export const smashingPerformance = definePitchFamily(fabPitchFamilies["smashing-performance"], {
  abilities: () => ({
    whenAttacksDrawDiscardRandomWithNumber6MorePowerDiscardedWayDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "draw",
              count: 1,
              player: "controller",
            },
            {
              type: "discard",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                count: 1,
                random: true,
              },
              outputBinding: "it",
            },
            {
              type: "conditional",
              condition: {
                type: "compare-amount",
                amount: {
                  type: "count",
                  what: "discarded-this-way",
                  filter: { power: { op: "gte", value: 6 } },
                },
                comparison: { op: "gte", value: 1 },
              },
              then: {
                type: "destroy",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "any",
                  zones: ["permanent"],
                  filter: {
                    typeBox: {
                      subtypes: ["Item"],
                    },
                  },
                  count: 1,
                  random: true,
                },
              },
            },
          ],
        },
      },
    },
  }),
});

export const { yellow: smashingPerformanceYellow } = smashingPerformance.cards;
