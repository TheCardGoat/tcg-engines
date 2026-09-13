import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lunarConduit: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0yetaebjlw",
  slug: "lunar-conduit",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0yetaebjlw:face:default",
      catalogId: "0yetaebjlw",
      name: "Lunar Conduit",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "STAFF"],
      },
      elements: ["ASTRA"],
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to materialize.\n\nWhenever you activate an astra element card, put a charge counter on Lunar Conduit.\n\n(3), REST: As a Spell, deal an amount of damage to target unit equal to the amount of charge counters on Lunar Conduit. Then remove a charge counter from Lunar Conduit.",
      abilities: [
        {
          id: "0yetaebjlw-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to materialize.",
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
              action: "materialize",
              subject: {
                kind: "source",
              },
              costKind: "memory",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "0yetaebjlw-a2",
          kind: "triggered",
          text: "Whenever you activate an astra element card, put a charge counter on Lunar Conduit.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "element",
                  oneOf: ["ASTRA"],
                },
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "charge",
            },
            amount: 1,
          },
        },
        {
          id: "0yetaebjlw-a3",
          kind: "activated",
          text: "(3), REST: As a Spell, deal an amount of damage to target unit equal to the amount of charge counters on Lunar Conduit. Then remove a charge counter from Lunar Conduit.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
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
                  amount: {
                    kind: "counter-count",
                    subject: {
                      kind: "source",
                    },
                    counter: {
                      named: "charge",
                    },
                  },
                },
              },
              {
                kind: "remove-counter",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "charge",
                },
                amount: 1,
                bindResultAs: "removed-counters",
              },
            ],
          },
        },
      ],
    },
  },
};

export default lunarConduit;
