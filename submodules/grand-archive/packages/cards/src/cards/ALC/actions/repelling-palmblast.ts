import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const repellingPalmblast: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4xippor7ch",
  slug: "repelling-palmblast",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4xippor7ch:face:default",
      catalogId: "4xippor7ch",
      name: "Repelling Palmblast",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "Return all allies with 2 POWER or less to their owner's memories.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "4xippor7ch-a1",
          kind: "card-resolution",
          text: "Return all allies with 2 POWER or less to their owner's memories.",
          effect: {
            kind: "move",
            subject: {
              kind: "each",
              collection: {
                zones: ["field"],
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "numeric",
                      comparison: {
                        left: {
                          kind: "property",
                          subject: {
                            kind: "candidate",
                          },
                          property: "power",
                          basis: "current",
                        },
                        operator: "lte",
                        right: 2,
                      },
                    },
                  ],
                },
              },
            },
            destination: {
              zone: "memory",
            },
          },
        },
        {
          id: "4xippor7ch-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default repellingPalmblast;
