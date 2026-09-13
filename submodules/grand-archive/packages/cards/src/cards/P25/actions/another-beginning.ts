import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const anotherBeginning: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Akf4kIBApN",
  slug: "another-beginning",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Akf4kIBApN:face:default",
      catalogId: "Akf4kIBApN",
      name: "Another Beginning",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText: "Materialize a regalia card with memory cost 0 from your material deck.",
      abilities: [
        {
          id: "Akf4kIBApN-a1",
          kind: "card-resolution",
          text: "Materialize a regalia card with memory cost 0 from your material deck.",
          effect: {
            kind: "choose",
            selection: {
              id: "materialized-card",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["material-deck"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "supertype",
                      oneOf: ["REGALIA"],
                    },
                    {
                      kind: "numeric",
                      comparison: {
                        left: {
                          kind: "property",
                          subject: {
                            kind: "candidate",
                          },
                          property: "memory-cost",
                          basis: "base",
                        },
                        operator: "eq",
                        right: 0,
                      },
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "materialize-card",
              subject: {
                kind: "bound",
                binding: "materialized-card",
              },
            },
          },
        },
      ],
    },
  },
};

export default anotherBeginning;
