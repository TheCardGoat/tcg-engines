import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const everflameStaff: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nrvth9vyz1",
  slug: "everflame-staff",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nrvth9vyz1:face:default",
      catalogId: "nrvth9vyz1",
      name: "Everflame Staff",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "STAFF"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "Whenever a fire element Spell source you control deals damage, put a refinement counter on Everflame Staff.\n\n[Class Bonus] Banish Everflame Staff: As a Spell, deal 4 damage to target champion. Activate this ability only if there are three or more refinement counters on Everflame Staff.",
      abilities: [
        {
          id: "nrvth9vyz1-a1",
          kind: "triggered",
          text: "Whenever a fire element Spell source you control deals damage, put a refinement counter on Everflame Staff.",
          trigger: {
            kind: "event",
            event: {
              name: "damage-dealt",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "element",
                      oneOf: ["FIRE"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SPELL"],
                    },
                  ],
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
              named: "refinement",
            },
            amount: 1,
          },
        },
        {
          id: "nrvth9vyz1-a2",
          kind: "activated",
          text: "[Class Bonus] Banish Everflame Staff: As a Spell, deal 4 damage to target champion. Activate this ability only if there are three or more refinement counters on Everflame Staff.",
          activation: "ability",
          cost: {
            kind: "banish-self",
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
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          condition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "refinement",
                },
              },
              operator: "gte",
              right: 3,
            },
          },
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
          effect: {
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
              amount: 4,
            },
          },
        },
      ],
    },
  },
};

export default everflameStaff;
