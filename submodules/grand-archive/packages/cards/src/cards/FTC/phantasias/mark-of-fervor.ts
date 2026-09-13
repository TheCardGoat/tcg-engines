import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const markOfFervor: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "80mttsvbgl",
  slug: "mark-of-fervor",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "80mttsvbgl:face:default",
      catalogId: "80mttsvbgl",
      name: "Mark of Fervor",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SPELL"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)\n\nLinked ally gets +1 POWER and +1 LIFE, and has vigor.",
      abilities: [
        {
          id: "80mttsvbgl-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ally Link (This object enters the field linked to target ally. If the link is broken, sacrifice this object.)",
          keyword: {
            name: "link",
            target: "ally",
          },
        },
        {
          id: "80mttsvbgl-a2",
          kind: "static",
          staticKind: "effects",
          text: "Linked ally gets +1 POWER and +1 LIFE, and has vigor.",
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
                  name: "vigor",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default markOfFervor;
