import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const verdantSlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "kkbbu08s5r",
  slug: "verdant-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "kkbbu08s5r:face:default",
      catalogId: "kkbbu08s5r",
      name: "Verdant Slime",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "SLIME"],
      },
      elements: ["TERA"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Pride 5\n\n[Class Bonus] Taunt\n\nOn Enter: Destroy up to one target regalia with memory cost 0. If you don't, put two buff counters on Verdant Slime.",
      abilities: [
        {
          id: "kkbbu08s5r-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 5",
          keyword: {
            name: "pride",
            value: 5,
          },
        },
        {
          id: "kkbbu08s5r-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Taunt",
          keyword: {
            name: "taunt",
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
        },
        {
          id: "kkbbu08s5r-a3",
          kind: "triggered",
          text: "On Enter: Destroy up to one target regalia with memory cost 0. If you don't, put two buff counters on Verdant Slime.",
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
                kind: "up-to",
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
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "target-is-legal",
              binding: "target-1",
            },
            then: {
              kind: "destroy",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
            },
            else: {
              kind: "add-counter",
              subject: {
                kind: "source",
              },
              counter: "buff",
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default verdantSlime;
