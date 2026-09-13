import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const boltOfDiamonds: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ek5r5YlFQv",
  slug: "bolt-of-diamonds",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ek5r5YlFQv:face:default",
      catalogId: "ek5r5YlFQv",
      name: "Bolt of Diamonds",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SUITED", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText: "[Level 2+] This card costs 2 less to activate.\n\nDeal 1 damage to target unit.",
      abilities: [
        {
          id: "ek5r5YlFQv-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Level 2+] This card costs 2 less to activate.",
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
                  right: 2,
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
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "ek5r5YlFQv-a2",
          kind: "card-resolution",
          text: "Deal 1 damage to target unit.",
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
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: 1,
          },
        },
      ],
    },
  },
};

export default boltOfDiamonds;
