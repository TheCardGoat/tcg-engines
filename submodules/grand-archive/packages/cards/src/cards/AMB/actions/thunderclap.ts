import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const thunderclap: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0xm513tj3j",
  slug: "thunderclap",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0xm513tj3j:face:default",
      catalogId: "0xm513tj3j",
      name: "Thunderclap",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Level 3+] This card costs 2 less to activate. (Apply this effect only if your champion is level 3 or higher.)\n\nDeal 4 damage to target ally. ",
      abilities: [
        {
          id: "0xm513tj3j-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Level 3+] This card costs 2 less to activate. (Apply this effect only if your champion is level 3 or higher.)",
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
          id: "0xm513tj3j-a2",
          kind: "card-resolution",
          text: "Deal 4 damage to target ally.",
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
                  oneOf: ["ALLY"],
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

export default thunderclap;
