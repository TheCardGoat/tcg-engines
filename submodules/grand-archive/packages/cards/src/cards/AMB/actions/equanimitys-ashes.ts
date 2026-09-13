import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const equanimitysAshes: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dZJBqul1Em",
  slug: "equanimitys-ashes",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dZJBqul1Em:face:default",
      catalogId: "dZJBqul1Em",
      name: "Equanimity's Ashes",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Level 3+] This card costs 3 less to activate. \n\nDeal 3 damage to target champion. \n\n[Class Bonus] Then if that champion has five or less damage counters on them, deal an additional 4 damage to them.",
      abilities: [
        {
          id: "dZJBqul1Em-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Level 3+] This card costs 3 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
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
                    basis: "current",
                  },
                  operator: "gte",
                  right: 3,
                },
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
          id: "dZJBqul1Em-a2",
          kind: "card-resolution",
          text: "Deal 3 damage to target champion.",
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
          id: "dZJBqul1Em-a3",
          kind: "ability-modifier",
          text: "[Class Bonus] Then if that champion has five or less damage counters on them, deal an additional 4 damage to them.",
          modifies: {
            kind: "preceding-non-modifier-ability",
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
          operation: {
            kind: "append-effect",
            effect: {
              kind: "conditional",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: "damage",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "bound",
                      binding: "target-1",
                    },
                    counter: "damage",
                  },
                  operator: "lte",
                  right: 5,
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
                amount: 4,
              },
            },
          },
        },
      ],
    },
  },
};

export default equanimitysAshes;
