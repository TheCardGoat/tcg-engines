import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const beastsoulVisage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8asbierp5k",
  slug: "beastsoul-visage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8asbierp5k:face:default",
      catalogId: "8asbierp5k",
      name: "Beastsoul Visage",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ACCESSORY"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)\n\nLinked ally gets +2 POWER, has pride 3, and is a Beast in addition to its other types.",
      abilities: [
        {
          id: "8asbierp5k-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)",
          keyword: {
            name: "link",
            target: "ally",
          },
        },
        {
          id: "8asbierp5k-a2",
          kind: "static",
          staticKind: "effects",
          executionSource: "linked-object",
          text: "Linked ally gets +2 POWER, has pride 3, and is a Beast in addition to its other types.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: 2,
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "pride",
                  value: 3,
                },
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "B",
                modifies: "type",
              },
              change: {
                kind: "add-characteristic",
                characteristic: {
                  kind: "subtype",
                  value: "BEAST",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default beastsoulVisage;
