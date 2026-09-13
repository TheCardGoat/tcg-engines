import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const intrepidSpearman: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pal7cpvn96",
  slug: "intrepid-spearman",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pal7cpvn96:face:default",
      catalogId: "pal7cpvn96",
      name: "Intrepid Spearman",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Level 1+] If combat damage would be dealt to Intrepid Spearman, reveal a card at random from your memory. If that card is wind element, prevent 3 of that damage. Apply this replacement effect only once per turn.",
      abilities: [
        {
          id: "pal7cpvn96-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Level 1+] If combat damage would be dealt to Intrepid Spearman, reveal a card at random from your memory. If that card is wind element, prevent 3 of that damage. Apply this replacement effect only once per turn.",
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 1,
                },
              },
            },
          ],
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "source",
                },
                combatDamage: true,
              },
              limit: {
                count: 1,
                per: "turn",
              },
              operation: {
                kind: "sequence",
                operations: [
                  {
                    kind: "perform-before-commit",
                    effect: {
                      kind: "reveal",
                      player: "controller",
                      selection: {
                        id: "revealed-card",
                        kind: "choice",
                        declared: "resolution",
                        chooser: "controller",
                        count: {
                          kind: "exactly",
                          amount: 1,
                        },
                        candidates: {
                          kind: "card",
                          zones: ["memory"],
                          relationship: "zone-of",
                          player: "controller",
                        },
                        method: "random",
                      },
                    },
                  },
                  {
                    kind: "prevent",
                    amount: {
                      kind: "conditional",
                      condition: {
                        kind: "collection-exists",
                        collection: {
                          binding: "revealed-card",
                          filter: {
                            kind: "element",
                            oneOf: ["WIND"],
                          },
                        },
                      },
                      then: 3,
                      else: 0,
                    },
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default intrepidSpearman;
