import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cooktechApron: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "oJIuGCrzPG",
  slug: "cooktech-apron",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "oJIuGCrzPG:face:default",
      catalogId: "oJIuGCrzPG",
      name: "CookTech Apron",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "VELTECH", "KITCHEN", "CLOAK"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)\n\nLinked ally gets +2LIFE.",
      abilities: [
        {
          id: "oJIuGCrzPG-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)",
          keyword: {
            name: "link",
            target: "ally",
          },
        },
        {
          id: "oJIuGCrzPG-a2",
          kind: "static",
          staticKind: "effects",
          text: "Linked ally gets +2LIFE.",
          executionSource: "linked-object",
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
                property: "life",
                operation: "add",
                amount: 2,
              },
            },
          ],
        },
      ],
    },
  },
};

export default cooktechApron;
