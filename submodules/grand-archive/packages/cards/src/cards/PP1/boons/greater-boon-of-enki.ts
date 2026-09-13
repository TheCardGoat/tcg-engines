import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const greaterBoonOfEnki: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fZZqzAXNAc",
  slug: "greater-boon-of-enki",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "fZZqzAXNAc:face:default",
      catalogId: "fZZqzAXNAc",
      name: "Greater Boon of Enki",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["GREATER BOON"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Level Locked 2 (Play this card only if your champion’s base level is 2 or higher.)\n\nAs you gain this boon, draw a card.\n\nWhenever you summon one or more tokens with reserve cost 1 or less for the first time each turn, summon a copy of one of those tokens.",
      abilities: [
        {
          id: "fZZqzAXNAc-a1",
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
          id: "fZZqzAXNAc-a2",
          kind: "triggered",
          text: "As you gain this boon, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "boon-gained",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "fZZqzAXNAc-a3",
          kind: "triggered",
          text: "Whenever you summon one or more tokens with reserve cost 1 or less for the first time each turn, summon a copy of one of those tokens.",
          trigger: {
            kind: "event",
            cardinality: "one-or-more",
            event: {
              name: "tokens-summoned",
              actor: "controller",
              occurrence: {
                count: 1,
                window: "this-turn",
                actorScope: "same-player",
              },
              subject: {
                kind: "event-object",
                bindAs: "summoned-token-batch",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "token",
                      value: true,
                    },
                    {
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
                        operator: "lte",
                        right: 1,
                      },
                    },
                  ],
                },
              },
            },
          },
          effect: {
            kind: "choose",
            selection: {
              id: "chosen-token",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                binding: "summoned-token-batch",
              },
            },
            effect: {
              kind: "summon-copies",
              controller: "controller",
              subjects: {
                kind: "bound",
                binding: "chosen-token",
              },
              token: true,
            },
          },
        },
      ],
    },
  },
};

export default greaterBoonOfEnki;
