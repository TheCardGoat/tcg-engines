import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const liturgyOfCorruption: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "BZMKfFZ22T",
  slug: "liturgy-of-corruption",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "BZMKfFZ22T:face:default",
      catalogId: "BZMKfFZ22T",
      name: "Liturgy of Corruption",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Put a buff counter on target ally. If that ally is fostered, put two additional buff counters on it and deal 6 unpreventable damage to your champion.",
      abilities: [
        {
          id: "BZMKfFZ22T-a1",
          kind: "card-resolution",
          text: "Put a buff counter on target ally. If that ally is fostered, put two additional buff counters on it and deal 6 unpreventable damage to your champion.",
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
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: "buff",
                amount: 1,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "object-state",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  state: "fostered",
                },
                then: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "add-counter",
                      subject: {
                        kind: "bound",
                        binding: "target-1",
                      },
                      counter: "buff",
                      amount: 2,
                    },
                    {
                      kind: "deal-damage",
                      source: {
                        kind: "source",
                      },
                      recipient: {
                        kind: "champion",
                        player: "controller",
                      },
                      amount: 6,
                      preventable: false,
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default liturgyOfCorruption;
