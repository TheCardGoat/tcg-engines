import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const greaterBoonOfConnection: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wc8IEEJUBL",
  slug: "greater-boon-of-connection",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wc8IEEJUBL:face:default",
      catalogId: "wc8IEEJUBL",
      name: "Greater Boon of Connection",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["GREATER BOON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Level Locked 2 (Play this card only if your champion’s base level is 2 or higher.)\n\nLinked allies you control get +1POWER for each object linked to it.\n\n(2), Sacrifice an object with ally link: Draw a card into your memory. This ability costs (1) more to activate for each time you've activated it this game.",
      abilities: [
        {
          id: "wc8IEEJUBL-a1",
          kind: "static",
          staticKind: "effects",
          text: "Level Locked 2 (Play this card only if your champion’s base level is 2 or higher.)",
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
                  right: 2,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "wc8IEEJUBL-a2",
          kind: "static",
          staticKind: "effects",
          text: "Linked allies you control get +1POWER for each object linked to it.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "linked",
                        value: true,
                      },
                    ],
                  },
                },
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
                amount: {
                  kind: "count",
                  collection: {
                    zones: ["field"],
                    host: {
                      kind: "candidate",
                    },
                    relationship: "linked-to",
                  },
                },
              },
            },
          ],
        },
        {
          id: "wc8IEEJUBL-a3",
          kind: "activated",
          text: "(2), Sacrifice an object with ally link: Draw a card into your memory. This ability costs (1) more to activate for each time you've activated it this game.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                bindResultAs: "sacrificed-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            ],
          },
          costModifiers: [
            {
              operation: "add",
              amount: {
                kind: "event-total",
                event: {
                  name: "ability-activated",
                  subject: {
                    kind: "source",
                  },
                },
                window: "game",
                metric: "event-count",
              },
            },
          ],
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default greaterBoonOfConnection;
