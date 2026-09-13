import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spirelleSchwartzQueen: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "p2n1953som",
  slug: "spirelle-schwartz-queen",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "p2n1953som:face:default",
      catalogId: "p2n1953som",
      name: "Spirelle, Schwartz Queen",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CHESSMAN", "QUEEN", "HUMAN"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 0,
        life: 4,
      },
      rulesText:
        "On Enter: As a Spell, deal 3 damage to target unit. Then you may banish a card from your hand or memory face down.\n\n(2), REST,  Reveal a card banished by Spirelle with reserve cost X: Negate each activation of cards with reserve cost X. Put each card negated this way and each card banished by Spirelle into their owner's memories. Then trigger each of Spirelle's  on enter abilities.",
      abilities: [
        {
          id: "p2n1953som-a1",
          kind: "triggered",
          text: "On Enter: As a Spell, deal 3 damage to target unit. Then you may banish a card from your hand or memory face down.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
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
                kind: "perform-as",
                sourceKind: "spell",
                effect: {
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
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "banish",
                  player: "controller",
                  selection: {
                    id: "banished-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["hand"],
                      relationship: "zone-of",
                      player: "controller",
                    },
                  },
                  faceDown: true,
                },
              },
            ],
          },
        },
        {
          id: "p2n1953som-a2",
          kind: "activated",
          text: "(2), REST,  Reveal a card banished by Spirelle with reserve cost X: Negate each activation of cards with reserve cost X. Put each card negated this way and each card banished by Spirelle into their owner's memories. Then trigger each of Spirelle's  on enter abilities.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "select-and-reveal",
                player: "controller",
                from: "banishment",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                host: {
                  kind: "source",
                },
                relationship: "banished-by",
                bindResultAs: "revealed-spirelle-card",
              },
            ],
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "property",
                subject: {
                  kind: "bound",
                  binding: "revealed-spirelle-card",
                },
                property: "reserve-cost",
                basis: "base",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "negate-matching-stack-items",
                candidates: {
                  kind: "stack-item",
                  itemTypes: ["card-activation"],
                  sourceFilter: {
                    kind: "numeric",
                    comparison: {
                      left: {
                        kind: "property",
                        subject: {
                          kind: "candidate",
                        },
                        property: "reserve-cost",
                        basis: "base",
                      },
                      operator: "eq",
                      right: {
                        kind: "property",
                        subject: {
                          kind: "bound",
                          binding: "revealed-spirelle-card",
                        },
                        property: "reserve-cost",
                        basis: "base",
                      },
                    },
                  },
                },
                bindResultAs: "negated-activations",
              },
              {
                kind: "move",
                subject: {
                  kind: "stack-source",
                  binding: "negated-activations",
                },
                destination: {
                  zone: "memory",
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "each",
                  collection: {
                    zones: ["banishment"],
                    host: {
                      kind: "source",
                    },
                    relationship: "banished-by",
                  },
                },
                destination: {
                  zone: "memory",
                },
              },
              {
                kind: "trigger-abilities",
                subject: {
                  kind: "source",
                },
                triggerName: "on-enter",
                count: "each",
              },
            ],
          },
        },
      ],
    },
  },
};

export default spirelleSchwartzQueen;
