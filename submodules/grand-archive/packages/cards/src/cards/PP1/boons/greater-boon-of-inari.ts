import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const greaterBoonOfInari: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ozltjoTDQe",
  slug: "greater-boon-of-inari",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "ozltjoTDQe:face:default",
      catalogId: "ozltjoTDQe",
      name: "Greater Boon of Inari",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["GREATER BOON"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Class Locked, Level Locked 2\n\nWhenever you gain agility, your champion's next attack this turn against a champion gets +2POWER.\n\nRemove a preparation counter from your champion: You gain agility 3 for this turn. Activate this ability only at slow speed and only once per turn.",
      abilities: [
        {
          id: "ozltjoTDQe-a1",
          kind: "static",
          staticKind: "effects",
          text: "Class Locked, Level Locked 2",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "play",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "champion-matches-source",
                    characteristic: "class",
                  },
                  {
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
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "ozltjoTDQe-a2",
          kind: "triggered",
          text: "Whenever you gain agility, your champion's next attack this turn against a champion gets +2POWER.",
          trigger: {
            kind: "event",
            event: {
              name: "player-state-changed",
              actor: "controller",
              state: "agility",
              to: true,
            },
          },
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "attack-declared",
                subject: {
                  kind: "event-object",
                  controller: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
                recipient: {
                  kind: "event-object",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
            },
            effect: {
              kind: "continuous",
              subjects: {
                kind: "current-attack",
              },
              affectedSet: "locked",
              duration: {
                kind: "this-attack",
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
            limit: 1,
            expires: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "ozltjoTDQe-a3",
          kind: "activated",
          text: "Remove a preparation counter from your champion: You gain agility 3 for this turn. Activate this ability only at slow speed and only once per turn.",
          activation: "ability",
          speed: "slow",
          cost: {
            kind: "remove-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "preparation",
            amount: 1,
          },
          limit: {
            count: 1,
            per: "turn",
          },
          effect: {
            kind: "set-player-state",
            player: "controller",
            state: "agility",
            value: true,
            amount: 3,
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default greaterBoonOfInari;
