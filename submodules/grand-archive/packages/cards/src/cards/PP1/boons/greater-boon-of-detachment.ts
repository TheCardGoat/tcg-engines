import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const greaterBoonOfDetachment: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "MzGWQK0E2o",
  slug: "greater-boon-of-detachment",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "MzGWQK0E2o:face:default",
      catalogId: "MzGWQK0E2o",
      name: "Greater Boon of Detachment",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["GREATER BOON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Class Locked, Level Locked 2\n\nYou may declare attacks with unloaded Ranger weapons you control as though they were loaded.\n\n(3): Target Ranger weapon gets +3POWER until end of turn. Activate this ability only once during each of your turns, and only if your champion is distant.\n",
      abilities: [
        {
          id: "MzGWQK0E2o-a1",
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
          id: "MzGWQK0E2o-a2",
          kind: "static",
          staticKind: "effects",
          text: "You may declare attacks with unloaded Ranger weapons you control as though they were loaded.",
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "use-weapon-for-attack",
              subject: {
                kind: "player",
                player: "controller",
              },
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["WEAPON"],
                  },
                  {
                    kind: "subtype",
                    oneOf: ["RANGER"],
                  },
                  {
                    kind: "not",
                    filter: {
                      kind: "object-state",
                      state: "loaded",
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
          id: "MzGWQK0E2o-a3",
          kind: "activated",
          text: "(3): Target Ranger weapon gets +3POWER until end of turn. Activate this ability only once during each of your turns, and only if your champion is distant.",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 3,
          },
          condition: {
            kind: "all",
            conditions: [
              {
                kind: "turn-player",
                player: "controller",
              },
              {
                kind: "object-state",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                state: "distant",
              },
            ],
          },
          targets: [
            {
              id: "target-ranger-weapon",
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
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["RANGER"],
                    },
                  ],
                },
              },
            },
          ],
          limit: {
            count: 1,
            per: "turn",
            whoseTurn: "controller",
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-ranger-weapon",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
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
              amount: 3,
            },
          },
        },
      ],
    },
  },
};

export default greaterBoonOfDetachment;
