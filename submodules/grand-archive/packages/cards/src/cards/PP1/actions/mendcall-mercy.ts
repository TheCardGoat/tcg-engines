import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mendcallMercy: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2RKjpzEFV6",
  slug: "mendcall-mercy",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "2RKjpzEFV6:face:default",
      catalogId: "2RKjpzEFV6",
      name: "Mendcall Mercy",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate.\n\nTarget player recovers X, where X is three times their champion's base level. If that player is an opponent, you gain the Crowd's Favor status.",
      abilities: [
        {
          id: "2RKjpzEFV6-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate.",
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
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "2RKjpzEFV6-a2",
          kind: "card-resolution",
          text: "Target player recovers X, where X is three times their champion's base level. If that player is an opponent, you gain the Crowd's Favor status.",
          targets: [
            {
              id: "target-player",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["controller", "opponent", "another-player"],
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "calculate",
                operator: "multiply",
                operands: [
                  3,
                  {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: {
                        binding: "target-player",
                      },
                    },
                    property: "level",
                    basis: "base",
                  },
                ],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "recover",
                player: {
                  binding: "target-player",
                },
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "player-relation",
                  player: {
                    binding: "target-player",
                  },
                  relation: "opponent-of-controller",
                },
                then: {
                  kind: "set-player-state",
                  player: "controller",
                  state: {
                    named: "crowds-favor",
                  },
                  value: true,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default mendcallMercy;
