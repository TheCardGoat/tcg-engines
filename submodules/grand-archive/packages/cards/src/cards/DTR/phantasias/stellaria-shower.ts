import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stellariaShower: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xmtjrvfpuc",
  slug: "stellaria-shower",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xmtjrvfpuc:face:default",
      catalogId: "xmtjrvfpuc",
      name: "Stellaria Shower",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FRACTAL"],
      },
      elements: ["ASTRA"],
      stats: {},
      rulesText:
        "Starcalling — (1)\n\nReservable\n\nOn Enter: If Stellaria Shower was starcalled, as a Spell, deal X damage to target unit, where X is the amount of phantasias you control.",
      abilities: [
        {
          id: "xmtjrvfpuc-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Starcalling — (1)",
          keyword: {
            name: "starcalling",
            cost: {
              kind: "pay-reserve",
              amount: 1,
            },
          },
        },
        {
          id: "xmtjrvfpuc-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Reservable",
          keyword: {
            name: "reservable",
          },
        },
        {
          id: "xmtjrvfpuc-a3",
          kind: "triggered",
          text: "On Enter: If Stellaria Shower was starcalled, as a Spell, deal X damage to target unit, where X is the amount of phantasias you control.",
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
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["PHANTASIA"],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "starcalled",
            },
            then: {
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
                  kind: "variable",
                  symbol: "X",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default stellariaShower;
