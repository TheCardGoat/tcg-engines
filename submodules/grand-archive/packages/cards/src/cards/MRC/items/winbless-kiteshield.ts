import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const winblessKiteshield: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uoy5ttkat9",
  slug: "winbless-kiteshield",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "uoy5ttkat9:face:default",
      catalogId: "uoy5ttkat9",
      name: "Winbless Kiteshield",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SHIELD"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to materialize.\n\nUnit Link (This object enters the field linked to target unit. If the link is broken, sacrifice this object.)\n\nLinked unit has vigor.",
      abilities: [
        {
          id: "uoy5ttkat9-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to materialize.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "materialize",
              subject: {
                kind: "source",
              },
              costKind: "memory",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "uoy5ttkat9-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Unit Link (This object enters the field linked to target unit. If the link is broken, sacrifice this object.)",
          keyword: {
            name: "link",
            target: "unit",
          },
        },
        {
          id: "uoy5ttkat9-a3",
          kind: "static",
          staticKind: "effects",
          text: "Linked unit has vigor.",
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

export default winblessKiteshield;
