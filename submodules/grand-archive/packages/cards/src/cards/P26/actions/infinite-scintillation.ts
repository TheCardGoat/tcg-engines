import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const infiniteScintillation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tC7GrWnlR5",
  slug: "infinite-scintillation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tC7GrWnlR5:face:default",
      catalogId: "tC7GrWnlR5",
      name: "Infinite Scintillation",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Move all sheen counters from target unit to your Fractured Memories. Then deal 1+X damage to that unit, where X is the amount of counters moved this way.\n\n[Sheen 6+] Floating Memory",
      abilities: [
        {
          id: "tC7GrWnlR5-a1",
          kind: "card-resolution",
          text: "Move all sheen counters from target unit to your Fractured Memories. Then deal 1+X damage to that unit, where X is the amount of counters moved this way.",
          targets: [
            {
              id: "target-unit",
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
                kind: "binding",
                binding: "moved-sheen-count",
              },
            },
          ],
          effect: {
            kind: "bind-value",
            value: {
              kind: "counter-count",
              subject: {
                kind: "bound",
                binding: "target-unit",
              },
              counter: {
                named: "sheen",
              },
            },
            bindAs: "moved-sheen-count",
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "move-counter",
                  from: {
                    kind: "bound",
                    binding: "target-unit",
                  },
                  to: {
                    kind: "mastery",
                    player: "controller",
                    name: "Fractured Memories",
                  },
                  counter: {
                    named: "sheen",
                  },
                  amount: {
                    kind: "binding",
                    binding: "moved-sheen-count",
                  },
                },
                {
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "bound",
                    binding: "target-unit",
                  },
                  amount: {
                    kind: "calculate",
                    operator: "add",
                    operands: [
                      1,
                      {
                        kind: "binding",
                        binding: "moved-sheen-count",
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        {
          id: "tC7GrWnlR5-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Sheen 6+] Floating Memory",
          keyword: {
            name: "floating-memory",
          },
          restrictions: [
            {
              kind: "static",
              name: "sheen-restriction",
              condition: {
                kind: "mastery-has-counter",
                mastery: "Fractured Memories",
                counter: {
                  named: "sheen",
                },
                minimum: 6,
              },
            },
          ],
        },
      ],
    },
  },
};

export default infiniteScintillation;
