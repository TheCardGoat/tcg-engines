import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rhesusEradication: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "KgjL9uCqm6",
  slug: "rhesus-eradication",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "KgjL9uCqm6:face:default",
      catalogId: "KgjL9uCqm6",
      name: "Rhesus Eradication",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ELYSIAN", "SPELL"],
      },
      elements: ["EXIA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal LV+X damage to target unit, where X is two times the amount of Elysian objects you control.",
      abilities: [
        {
          id: "KgjL9uCqm6-a1",
          kind: "card-resolution",
          text: "Deal LV+X damage to target unit, where X is two times the amount of Elysian objects you control.",
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
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "calculate",
                operator: "multiply",
                operands: [
                  {
                    kind: "count",
                    collection: {
                      zones: ["field"],
                      player: "controller",
                      filter: {
                        kind: "subtype",
                        oneOf: ["ELYSIAN"],
                      },
                    },
                  },
                  2,
                ],
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
            amount: {
              kind: "calculate",
              operator: "add",
              operands: [
                {
                  kind: "property",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  property: "level",
                  basis: "current",
                },
                {
                  kind: "variable",
                  symbol: "X",
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default rhesusEradication;
