import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const geldusTerrorOfDorumegia: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "n9yvn1uoy5",
  slug: "geldus-terror-of-dorumegia",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "n9yvn1uoy5:face:default",
      catalogId: "n9yvn1uoy5",
      name: "Geldus, Terror of Dorumegia",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "BULL"],
      },
      elements: ["NORM"],
      stats: {
        power: 5,
        life: 8,
      },
      rulesText:
        "Pride 4\n\n[Level 3+] This card costs 2 less to activate.\n\n[Class Bonus] On Enter: Geldus gains your choice of spellshroud or taunt until the beginning of your next turn.",
      abilities: [
        {
          id: "n9yvn1uoy5-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 4",
          keyword: {
            name: "pride",
            value: 4,
          },
        },
        {
          id: "n9yvn1uoy5-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Level 3+] This card costs 2 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 3,
                },
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "n9yvn1uoy5-a3",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Geldus gains your choice of spellshroud or taunt until the beginning of your next turn.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
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
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            modes: [
              {
                id: "choice-1",
                text: "spellshroud",
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "source",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "until-start-of-turn",
                    whose: "controller",
                  },
                  layer: {
                    layer: "D",
                    modifies: "ability",
                  },
                  change: {
                    kind: "grant-keyword",
                    keyword: {
                      name: "spellshroud",
                    },
                  },
                },
              },
              {
                id: "choice-2",
                text: "taunt",
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "source",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "until-start-of-turn",
                    whose: "controller",
                  },
                  layer: {
                    layer: "D",
                    modifies: "ability",
                  },
                  change: {
                    kind: "grant-keyword",
                    keyword: {
                      name: "taunt",
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default geldusTerrorOfDorumegia;
