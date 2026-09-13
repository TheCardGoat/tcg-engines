import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tomeOfSacredLightning: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "MyUTeqUJ0H",
  slug: "tome-of-sacred-lightning",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "MyUTeqUJ0H:face:default",
      catalogId: "MyUTeqUJ0H",
      name: "Tome of Sacred Lightning",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "BOOK"],
      },
      elements: ["ARCANE"],
      stats: {},
      rulesText:
        "[Element Bonus] You may banish a Book regalia you control to activate this card from your material deck. If you do, Tome of Sacred Lightning enters the field with all abilities of the banished card.\n\n[Class Bonus] REST: Banish a card at random from your memory. If a card was banished this way, draw a card.",
      abilities: [
        {
          id: "MyUTeqUJ0H-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Element Bonus] You may banish a Book regalia you control to activate this card from your material deck. If you do, Tome of Sacred Lightning enters the field with all abilities of the banished card.",
          restrictions: [
            {
              kind: "static",
              name: "element-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "element",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "material-deck",
              cost: {
                kind: "select-and-move",
                player: "controller",
                from: "field",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                relationship: "controlled-by",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "supertype",
                      oneOf: ["REGALIA"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["BOOK"],
                    },
                  ],
                },
                bindResultAs: "banished-book",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                from: "effects-stack",
                subject: {
                  kind: "source",
                },
                cause: {
                  kind: "card-activation",
                  controller: "controller",
                },
              },
              operation: {
                kind: "perform-before-commit",
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "source",
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
                    kind: "copy-abilities",
                    from: {
                      kind: "each",
                      collection: {
                        zones: ["banishment"],
                        host: {
                          kind: "source",
                        },
                        relationship: "activation-payment-of",
                        filter: {
                          kind: "all",
                          filters: [
                            {
                              kind: "supertype",
                              oneOf: ["REGALIA"],
                            },
                            {
                              kind: "subtype",
                              oneOf: ["BOOK"],
                            },
                          ],
                        },
                      },
                    },
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "MyUTeqUJ0H-a2",
          kind: "activated",
          text: "[Class Bonus] REST: Banish a card at random from your memory. If a card was banished this way, draw a card.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
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
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                bindSucceededAs: "card-was-banished",
                effect: {
                  kind: "banish",
                  player: "controller",
                  selection: {
                    id: "random-banished-card",
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
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "card-was-banished",
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default tomeOfSacredLightning;
