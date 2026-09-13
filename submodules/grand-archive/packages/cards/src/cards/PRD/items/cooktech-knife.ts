import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cooktechKnife: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6sZXj2SZW6",
  slug: "cooktech-knife",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6sZXj2SZW6:face:default",
      catalogId: "6sZXj2SZW6",
      name: "CookTech Knife",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "VELTECH", "KITCHEN", "DAGGER"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)\n\nLinked ally gets +1POWER.",
      abilities: [
        {
          id: "6sZXj2SZW6-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)",
          keyword: {
            name: "link",
            target: "ally",
          },
        },
        {
          id: "6sZXj2SZW6-a2",
          kind: "static",
          staticKind: "effects",
          text: "Linked ally gets +1POWER.",
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
                property: "power",
                operation: "add",
                amount: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

export default cooktechKnife;
