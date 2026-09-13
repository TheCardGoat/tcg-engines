import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const condensedSupernova: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "14m4c8ljye",
  slug: "condensed-supernova",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "14m4c8ljye:face:default",
      catalogId: "14m4c8ljye",
      name: "Condensed Supernova",
      cost: {
        kind: "reserve",
        amount: 7,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "POTION"],
      },
      elements: ["ASTRA"],
      stats: {},
      rulesText:
        "Brew — One Silvershine, Two Adjuvants, Two Catalysts\n\nSacrifice Condensed Supernova: Deal LV damage to all non-astra element units. Glimpse 4. (LV refers to your champion's level.)",
      abilities: [
        {
          id: "14m4c8ljye-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — One Silvershine, Two Adjuvants, Two Catalysts",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "name",
                value: "Silvershine",
                count: 1,
              },
              {
                kind: "subtype",
                value: "Adjuvant",
                count: 2,
              },
              {
                kind: "subtype",
                value: "Catalyst",
                count: 2,
              },
            ],
          },
        },
        {
          id: "14m4c8ljye-a2",
          kind: "activated",
          text: "Sacrifice Condensed Supernova: Deal LV damage to all non-astra element units. Glimpse 4. (LV refers to your champion's level.)",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
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
                          kind: "not",
                          filter: {
                            kind: "element",
                            oneOf: ["ASTRA"],
                          },
                        },
                        {
                          kind: "type",
                          oneOf: ["ALLY", "CHAMPION"],
                        },
                      ],
                    },
                  },
                },
                amount: {
                  kind: "property",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  property: "level",
                  basis: "current",
                },
              },
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: 4,
              },
            ],
          },
        },
      ],
    },
  },
};

export default condensedSupernova;
