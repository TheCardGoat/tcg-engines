import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const manaResonance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qp65vbdw7c",
  slug: "mana-resonance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qp65vbdw7c:face:default",
      catalogId: "qp65vbdw7c",
      name: "Mana Resonance",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs X less to activate, where X is the highest reserve cost among Spell cards your opponents control on the effects stack.\n\nDraw a card. Then if no cards were reserved into your memory to pay for this card's reserve cost, draw an additional card. ",
      abilities: [
        {
          id: "qp65vbdw7c-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs X less to activate, where X is the highest reserve cost among Spell cards your opponents control on the effects stack.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "aggregate-property",
                operation: "maximum",
                collection: {
                  zones: ["effects-stack"],
                  player: "each-opponent",
                  filter: {
                    kind: "subtype",
                    oneOf: ["SPELL"],
                  },
                },
                property: "reserve-cost",
                basis: "base",
                emptyValue: 0,
              },
            },
          ],
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
              amount: {
                kind: "aggregate-property",
                operation: "maximum",
                collection: {
                  zones: ["effects-stack"],
                  player: "each-opponent",
                  filter: {
                    kind: "subtype",
                    oneOf: ["SPELL"],
                  },
                },
                property: "reserve-cost",
                basis: "base",
                emptyValue: 0,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "qp65vbdw7c-a2",
          kind: "card-resolution",
          text: "Draw a card. Then if no cards were reserved into your memory to pay for this card's reserve cost, draw an additional card.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "source-activation-context",
                  reservedCardsToMemory: {
                    left: {
                      kind: "activation-payment-card-count",
                      to: "memory",
                    },
                    operator: "eq",
                    right: 0,
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default manaResonance;
