import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rebelliousBull: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "GXeEa0pe3B",
  slug: "rebellious-bull",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "GXeEa0pe3B:face:default",
      catalogId: "GXeEa0pe3B",
      name: "Rebellious Bull",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "BULL"],
      },
      elements: ["NORM"],
      stats: {
        power: 3,
        life: 4,
      },
      rulesText:
        "Rebellious Bull enters the field rested.\n\nPride 3 (This ally won't obey you unless your champion is level 3 or higher.)",
      abilities: [
        {
          id: "GXeEa0pe3B-a1",
          kind: "static",
          staticKind: "effects",
          text: "Rebellious Bull enters the field rested.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              operation: {
                kind: "modify-object-state",
                state: "rested",
                value: true,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "GXeEa0pe3B-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 3 (This ally won't obey you unless your champion is level 3 or higher.)",
          keyword: {
            name: "pride",
            value: 3,
          },
        },
      ],
    },
  },
};

export default rebelliousBull;
