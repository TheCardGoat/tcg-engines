import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cauterizingSeraphim: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "TYlWgIYsq3",
  slug: "cauterizing-seraphim",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "TYlWgIYsq3:face:default",
      catalogId: "TYlWgIYsq3",
      name: "Cauterizing Seraphim",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ANGEL"],
      },
      elements: ["FIRE"],
      stats: {
        power: 0,
        life: 1,
      },
      rulesText:
        "Advanced Imbue X (You may reserve all cards revealed as you activate this card. If at least X of them are advanced element, this card becomes imbued.)\n\nOn Enter: If Cauterizing Seraphim was imbued, deal X damage to all other norm and basic element allies.",
      abilities: [
        {
          id: "TYlWgIYsq3-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Advanced Imbue X (You may reserve all cards revealed as you activate this card. If at least X of them are advanced element, this card becomes imbued.)",
          variables: [
            {
              symbol: "X",
              kind: "chosen",
              minimum: 0,
            },
          ],
          keyword: {
            name: "imbue",
            value: {
              kind: "variable",
              symbol: "X",
            },
            elementRequirement: "advanced",
          },
        },
        {
          id: "TYlWgIYsq3-a2",
          kind: "triggered",
          text: "On Enter: If Cauterizing Seraphim was imbued, deal X damage to all other norm and basic element allies.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "imbued",
            },
            then: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "element-category",
                        value: "basic",
                      },
                      {
                        kind: "not-source",
                      },
                    ],
                  },
                },
              },
              amount: {
                kind: "variable",
                symbol: "X",
              },
            },
          },
        },
      ],
    },
  },
};

export default cauterizingSeraphim;
