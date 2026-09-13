import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const wildheartLyre: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "50pcescfpw",
  slug: "wildheart-lyre",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "50pcescfpw:face:default",
      catalogId: "50pcescfpw",
      name: "Wildheart Lyre",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "INSTRUMENT"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.) \n\n[Class Bonus] Whenever you rest Wildheart Lyre to pay for the reserve cost of a Harmony or Melody activation, put a buff counter on an Animal or Beast ally you control.",
      abilities: [
        {
          id: "50pcescfpw-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
          keyword: {
            name: "reservable",
          },
        },
        {
          id: "50pcescfpw-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever you rest Wildheart Lyre to pay for the reserve cost of a Harmony or Melody activation, put a buff counter on an Animal or Beast ally you control.",
          trigger: {
            kind: "event",
            event: {
              name: "object-state-changed",
              subject: {
                kind: "source",
              },
              state: "rested",
              to: true,
              cause: {
                kind: "cost-payment",
                costKind: "reserve",
                forCardFilter: {
                  kind: "any",
                  filters: [
                    {
                      kind: "subtype",
                      oneOf: ["HARMONY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["MELODY"],
                    },
                  ],
                },
              },
            },
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
          effect: {
            kind: "choose",
            selection: {
              id: "chosen-animal-or-beast",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "any",
                      filters: [
                        {
                          kind: "subtype",
                          oneOf: ["ANIMAL"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["BEAST"],
                        },
                      ],
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "add-counter",
              subject: {
                kind: "bound",
                binding: "chosen-animal-or-beast",
              },
              counter: "buff",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default wildheartLyre;
