import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fracturedCrown: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "suo6gb0op3",
  slug: "fractured-crown",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "suo6gb0op3:face:default",
      catalogId: "suo6gb0op3",
      name: "Fractured Crown",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "ARTIFACT"],
      },
      elements: ["LUXEM"],
      stats: {},
      rulesText:
        "Champion Link (This object enters the field linked to target champion. If the link is broken, sacrifice this object.)\n\nLinked champion's first attack each turn gets +2 POWER. Class Bonus: That champion also gets +2 LIFE for each unique ally card in your graveyard.",
      abilities: [
        {
          id: "suo6gb0op3-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Champion Link (This object enters the field linked to target champion. If the link is broken, sacrifice this object.)",
          keyword: {
            name: "link",
            target: "champion",
          },
        },
        {
          id: "suo6gb0op3-a2",
          kind: "static",
          staticKind: "effects",
          text: "Linked champion's first attack each turn gets +2 POWER. Class Bonus: That champion also gets +2 LIFE for each unique ally card in your graveyard.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "attacks-by",
                attacker: {
                  kind: "linked-object",
                },
              },
              affectedSet: "dynamic",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "event-total",
                    event: {
                      name: "attack-declared",
                      subject: {
                        kind: "linked-object",
                      },
                    },
                    window: "this-turn",
                    metric: "event-count",
                  },
                  operator: "eq",
                  right: 1,
                },
              },
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
                kind: "linked-object",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
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
                amount: {
                  kind: "calculate",
                  operator: "multiply",
                  operands: [
                    2,
                    {
                      kind: "count",
                      collection: {
                        zones: ["graveyard"],
                        player: "controller",
                        filter: {
                          kind: "type",
                          oneOf: ["ALLY"],
                        },
                      },
                      distinctBy: "name",
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default fracturedCrown;
