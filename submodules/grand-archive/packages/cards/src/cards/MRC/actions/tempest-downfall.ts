import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tempestDownfall: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4etkr73opc",
  slug: "tempest-downfall",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4etkr73opc:face:default",
      catalogId: "4etkr73opc",
      name: "Tempest Downfall",
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
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 3 less to activate if an ally has been suppressed this turn.\n\nDeal 3 damage to target unit. If that unit is an ally that entered the field this turn, deal an additional 3 damage to it.",
      abilities: [
        {
          id: "4etkr73opc-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 3 less to activate if an ally has been suppressed this turn.",
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
              condition: {
                kind: "history",
                event: "keyword-action-performed",
                window: "this-turn",
                keywordAction: "suppress",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
                minimum: 1,
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
          id: "4etkr73opc-a2",
          kind: "card-resolution",
          text: "Deal 3 damage to target unit. If that unit is an ally that entered the field this turn, deal an additional 3 damage to it.",
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
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
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
                  binding: "target-1",
                },
                amount: 3,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
                then: {
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  amount: 3,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default tempestDownfall;
