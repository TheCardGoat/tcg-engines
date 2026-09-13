import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aeneanPointedFlare: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "BTapvu1Zvd",
  slug: "aenean-pointed-flare",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "BTapvu1Zvd:face:default",
      catalogId: "BTapvu1Zvd",
      name: "Aenean Pointed Flare",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "AENEAN", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Level 3+] This card costs 2 less to activate.\n\nDeal 4 damage to target champion.",
      abilities: [
        {
          id: "BTapvu1Zvd-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Level 3+] This card costs 2 less to activate.",
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
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "BTapvu1Zvd-a2",
          kind: "card-resolution",
          text: "Deal 4 damage to target champion.",
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
            amount: 4,
          },
        },
      ],
    },
  },
};

export default aeneanPointedFlare;
