import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const samaritansReach: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "MskPCrbv0L",
  slug: "samaritans-reach",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "MskPCrbv0L:face:default",
      catalogId: "MskPCrbv0L",
      name: "Samaritan's Reach",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate.\n\nDeal 3 damage to target attacking ally you don't control. If that ally is attacking a unit you don't control, you gain the Crowd's Favor status.",
      abilities: [
        {
          id: "MskPCrbv0L-a1",
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
          id: "MskPCrbv0L-a2",
          kind: "card-resolution",
          text: "Deal 3 damage to target attacking ally you don't control. If that ally is attacking a unit you don't control, you gain the Crowd's Favor status.",
          targets: [
            {
              id: "target-attacking-ally",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "object-state",
                      state: "attacking",
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-attacking-ally",
                },
                amount: 3,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "current-attack-target-matches",
                  controller: "opponent",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY", "CHAMPION"],
                  },
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

export default samaritansReach;
