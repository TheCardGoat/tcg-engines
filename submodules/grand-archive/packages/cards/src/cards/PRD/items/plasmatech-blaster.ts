import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const plasmatechBlaster: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "PAymR7JsNp",
  slug: "plasmatech-blaster",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "PAymR7JsNp:face:default",
      catalogId: "PAymR7JsNp",
      name: "PlasmaTech Blaster",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "VELTECH", "GUN"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Ally Link\n\nLinked ally has ranged 2 and true sight.\n\n(3), REST: If linked ally is a Ranger, it becomes distant. (Units stay distant until the end of their controller’s turn.)",
      abilities: [
        {
          id: "PAymR7JsNp-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ally Link",
          keyword: {
            name: "link",
            target: "ally",
          },
        },
        {
          id: "PAymR7JsNp-a2",
          kind: "static",
          staticKind: "effects",
          text: "Linked ally has ranged 2 and true sight.",
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
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "ranged",
                  value: 2,
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
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "true-sight",
                },
              },
            },
          ],
        },
        {
          id: "PAymR7JsNp-a3",
          kind: "activated",
          text: "(3), REST: If linked ally is a Ranger, it becomes distant. (Units stay distant until the end of their controller’s turn.)",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "subject-matches",
              subject: {
                kind: "linked-object",
              },
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                  {
                    kind: "subtype",
                    oneOf: ["RANGER"],
                  },
                ],
              },
            },
            then: {
              kind: "set-object-state",
              subject: {
                kind: "linked-object",
              },
              state: "distant",
              value: true,
            },
          },
        },
      ],
    },
  },
};

export default plasmatechBlaster;
