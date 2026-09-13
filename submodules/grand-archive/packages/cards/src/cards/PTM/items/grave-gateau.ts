import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const graveGateau: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "FQigf17dCr",
  slug: "grave-gateau",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "FQigf17dCr:face:default",
      catalogId: "FQigf17dCr",
      name: "Grave Gateau",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER", "FOOD"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Hindered (This object enters the field rested.)\n\nREST, Sacrifice Grave Gateau: Put a buff counter on target Specter ally.\n\n[Alice Bonus] Ephemerate — (1)",
      abilities: [
        {
          id: "FQigf17dCr-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This object enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "FQigf17dCr-a2",
          kind: "activated",
          text: "REST, Sacrifice Grave Gateau: Put a buff counter on target Specter ally.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "sacrifice",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SPECTER"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "buff",
            amount: 1,
          },
        },
        {
          id: "FQigf17dCr-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Alice Bonus] Ephemerate — (1)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "pay-reserve",
              amount: 1,
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
        },
      ],
    },
  },
};

export default graveGateau;
