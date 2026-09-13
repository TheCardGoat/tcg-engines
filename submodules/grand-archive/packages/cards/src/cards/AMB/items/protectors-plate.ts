import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const protectorsPlate: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "i1j4gvwbjo",
  slug: "protectors-plate",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "i1j4gvwbjo:face:default",
      catalogId: "i1j4gvwbjo",
      name: "Protector's Plate",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "ARMOR"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)\n\nLinked ally gets +1 LIFE and has intercept.",
      abilities: [
        {
          id: "i1j4gvwbjo-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)",
          keyword: {
            name: "link",
            target: "ally",
          },
        },
        {
          id: "i1j4gvwbjo-a2",
          kind: "static",
          staticKind: "effects",
          text: "Linked ally gets +1 LIFE and has intercept.",
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
                amount: 1,
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
                  name: "intercept",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default protectorsPlate;
