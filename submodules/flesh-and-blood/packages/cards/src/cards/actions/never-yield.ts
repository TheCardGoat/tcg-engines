import { compareAmount } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/never-yield.generated.ts";

const equipmentControlled = {
  type: "count" as const,
  what: "cards-in-zone" as const,
  zone: "permanent" as const,
  filter: { typeBox: { types: ["Equipment"] as const } },
};

export const neverYield = definePitchFamily(fabPitchFamilies["never-yield"], {
  abilities: () => ({
    startTurnDestroyNeverYieldThenNoHandDrawLessLifeThanAllOtherGain2LifeLessEquipmentThanAllOtherRemove1DefenseCounterEquipment:
      {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "start-phase",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "none",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "destroy",
                target: {
                  selector: "self",
                },
              },
              {
                type: "conditional",
                condition: {
                  type: "zone-count",
                  zone: "hand",
                  player: "controller",
                  comparison: {
                    op: "eq",
                    value: 0,
                  },
                },
                then: {
                  type: "draw",
                  count: 1,
                  player: "controller",
                },
              },
              {
                type: "conditional",
                condition: {
                  type: "life-comparison",
                  player: "self",
                  vs: "each-other-hero",
                  op: "lt",
                },
                then: {
                  type: "gain-life",
                  amount: 2,
                  target: {
                    selector: "controller",
                  },
                },
              },
              {
                type: "conditional",
                condition: compareAmount(
                  { ...equipmentControlled, player: "controller" },
                  {
                    op: "lt",
                    value: { ...equipmentControlled, player: "opponent" },
                  },
                ),
                then: {
                  type: "remove-counters",
                  counter: {
                    kind: "numeric",
                    value: -1,
                    property: "defense",
                  },
                  count: 1,
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["permanent"],
                    filter: {
                      typeBox: {
                        types: ["Equipment"],
                      },
                    },
                    count: 1,
                  },
                },
              },
            ],
          },
        },
      },
  }),
});

export const { blue: neverYieldBlue } = neverYield.cards;
