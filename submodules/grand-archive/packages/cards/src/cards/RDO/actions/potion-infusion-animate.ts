import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const potionInfusionAnimate: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nDYInWoAnw",
  slug: "potion-infusion-animate",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nDYInWoAnw:face:default",
      catalogId: "nDYInWoAnw",
      name: "Potion Infusion: Animate",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Arisanna Bonus] This card costs 2 less to activate. \n\nRest target non-regalia Potion. If you do, it becomes an ally in addition to its other types with base power and life equal to its reserve cost. Each of its activated abilities becomes an on death triggered ability. (This effect lasts indefinitely.)",
      abilities: [
        {
          id: "nDYInWoAnw-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Arisanna Bonus] This card costs 2 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Arisanna",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "nDYInWoAnw-a2",
          kind: "card-resolution",
          text: "Rest target non-regalia Potion. If you do, it becomes an ally in addition to its other types with base power and life equal to its reserve cost. Each of its activated abilities becomes an on death triggered ability. (This effect lasts indefinitely.)",
          targets: [
            {
              id: "target-potion",
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
                  kind: "supertype",
                  oneOf: ["REGALIA"],
                },
              },
            },
          ],
          effect: {
            kind: "reflexive",
            action: {
              kind: "rest",
              subject: {
                kind: "bound",
                binding: "target-potion",
              },
            },
            consequence: {
              kind: "sequence",
              effects: [
                {
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "target-potion",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "permanent",
                  },
                  layer: {
                    layer: "B",
                    modifies: "type",
                  },
                  change: {
                    kind: "add-characteristic",
                    characteristic: {
                      kind: "type",
                      value: "ALLY",
                    },
                  },
                },
                {
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "target-potion",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "permanent",
                  },
                  layer: {
                    layer: "A",
                    modifies: "base-stats",
                  },
                  change: {
                    kind: "numeric",
                    property: "power",
                    operation: "set",
                    amount: {
                      kind: "property",
                      subject: {
                        kind: "bound",
                        binding: "target-potion",
                      },
                      property: "reserve-cost",
                      basis: "base",
                    },
                  },
                },
                {
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "target-potion",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "permanent",
                  },
                  layer: {
                    layer: "A",
                    modifies: "base-stats",
                  },
                  change: {
                    kind: "numeric",
                    property: "life",
                    operation: "set",
                    amount: {
                      kind: "property",
                      subject: {
                        kind: "bound",
                        binding: "target-potion",
                      },
                      property: "reserve-cost",
                      basis: "base",
                    },
                  },
                },
                {
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "target-potion",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "permanent",
                  },
                  layer: {
                    layer: "D",
                    modifies: "ability",
                  },
                  change: {
                    kind: "transform-abilities",
                    from: {
                      kind: "activated",
                    },
                    to: {
                      kind: "triggered",
                      event: "object-died",
                    },
                    preserveActivationCosts: false,
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default potionInfusionAnimate;
