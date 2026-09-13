import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { arcaneBarrier } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/evo-heartdrive.generated.ts";

export const evoHeartdrive = definePitchFamily(fabPitchFamilies["evo-heartdrive"], {
  keywords: [arcaneBarrier(1)],
  abilities: () => ({
    ifHaveBaseChestEquippedTransformIntoThenEquip: {
      kind: "resolution",
      condition: {
        type: "equipped-count",
        filter: {
          typeBox: {
            types: ["Equipment"],
            subtypes: ["Base", "Chest"],
          },
        },
        comparison: {
          op: "gte",
          value: 1,
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "transform",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["equipment-chest"],
              filter: {
                typeBox: {
                  types: ["Equipment"],
                  subtypes: ["Base", "Chest"],
                },
              },
              count: 1,
            },
            into: "this",
          },
          {
            type: "equip",
            target: {
              selector: "self",
            },
          },
        ],
      },
      label: {
        name: "transform",
      },
    },
    whenIsEquippedNextAttackActionPlayTurnCosts: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "equip",
          actor: {
            kind: "player",
            player: "ability-controller",
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
          type: "modify-numeric",
          property: "cost",
          op: "subtract",
          amount: 1,
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          // Action is a type-box type; Attack is a subtype. An `and` of two
          // subtype filters never matches a real AAC (Action is not a subtype).
          appliesTo: nextAttackActionLatch(),
        },
      },
    },
  }),
});

export const { blue: evoHeartdriveBlue } = evoHeartdrive.cards;
