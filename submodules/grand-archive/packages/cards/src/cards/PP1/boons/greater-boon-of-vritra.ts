import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const greaterBoonOfVritra: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jMH26KLgcd",
  slug: "greater-boon-of-vritra",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "jMH26KLgcd:face:default",
      catalogId: "jMH26KLgcd",
      name: "Greater Boon of Vritra",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["GREATER BOON"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Level Locked 1\n\nAt the beginning of your end phase, deal X+Y damage to a random target champion you don’t control, where X is the amount of fire element boons in your pantheon, and Y is the amount of fire element cards in your champion’s lineage.",
      abilities: [
        {
          id: "jMH26KLgcd-a1",
          kind: "static",
          staticKind: "effects",
          text: "Level Locked 1",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "play",
              subject: {
                kind: "source",
              },
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
                    basis: "base",
                  },
                  operator: "gte",
                  right: 1,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "jMH26KLgcd-a2",
          kind: "triggered",
          text: "At the beginning of your end phase, deal X+Y damage to a random target champion you don’t control, where X is the amount of fire element boons in your pantheon, and Y is the amount of fire element cards in your champion’s lineage.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "opponent",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
              method: "random",
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["pantheon"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "element",
                        oneOf: ["FIRE"],
                      },
                      {
                        kind: "type",
                        oneOf: ["GREATER BOON", "LESSER BOON"],
                      },
                    ],
                  },
                },
              },
            },
            {
              symbol: "Y",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["inner-lineage"],
                  host: {
                    kind: "champion",
                    player: "controller",
                  },
                  relationship: "lineage-of",
                  filter: {
                    kind: "element",
                    oneOf: ["FIRE"],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: {
              kind: "calculate",
              operator: "add",
              operands: [
                {
                  kind: "variable",
                  symbol: "X",
                },
                {
                  kind: "variable",
                  symbol: "Y",
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default greaterBoonOfVritra;
