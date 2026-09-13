import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/evo-buzz-hive.generated.ts";

export const evoBuzzHive = definePitchFamily(fabPitchFamilies["evo-buzz-hive"], {
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
    whenIsEquippedGain: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "equip",
          actor: {
            kind: "any",
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
          type: "gain-resources",
          amount: 1,
        },
      },
      label: {
        name: "transform",
      },
    },
  }),
});

export const { yellow: evoBuzzHiveYellow } = evoBuzzHive.cards;
