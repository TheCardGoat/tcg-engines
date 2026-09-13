import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const calamityCannon: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lwabipl6gt",
  slug: "calamity-cannon",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lwabipl6gt:face:default",
      catalogId: "lwabipl6gt",
      name: "Calamity Cannon",
      cost: {
        kind: "reserve",
        amount: 7,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL", "REACTION"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Polkhawk Bonus] This card costs 3 less to activate.\n\nYour champion’s first attack using a Gun weapon during your next turn gets +10 POWER.",
      abilities: [
        {
          id: "lwabipl6gt-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Polkhawk Bonus] This card costs 3 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Polkhawk",
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
              amount: 3,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "lwabipl6gt-a2",
          kind: "card-resolution",
          text: "Your champion’s first attack using a Gun weapon during your next turn gets +10 POWER.",
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "turn-begins",
                actor: "controller",
              },
            },
            limit: 1,
            effect: {
              kind: "create-delayed-trigger",
              trigger: {
                kind: "event",
                event: {
                  name: "attack-declared",
                  actor: "controller",
                  subject: {
                    kind: "event-object",
                    controller: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                  },
                  using: {
                    kind: "event-object",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["WEAPON"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["GUN"],
                        },
                      ],
                    },
                  },
                },
              },
              limit: 1,
              expires: {
                kind: "this-turn",
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
                  amount: 10,
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default calamityCannon;
