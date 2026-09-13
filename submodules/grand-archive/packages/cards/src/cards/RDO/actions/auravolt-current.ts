import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const auravoltCurrent: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "foy5mdrVCR",
  slug: "auravolt-current",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "foy5mdrVCR:face:default",
      catalogId: "foy5mdrVCR",
      name: "Auravolt Current",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["ARCANE"],
      speed: "slow",
      stats: {},
      rulesText:
        "You may activate this card from your banishment as long as there’s a charge counter on it.\n\nWhenever this card is banished from your memory, put a charge counter on it.\n\nAny amount of target players banish two cards from their memory. For each card banished this way, its owner draws a card into their memory. Banish Auravolt Current.\n",
      abilities: [
        {
          id: "foy5mdrVCR-a1",
          kind: "static",
          staticKind: "effects",
          text: "You may activate this card from your banishment as long as there’s a charge counter on it.",
          functionalZones: ["banishment"],
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "charge",
                },
              },
              fromZone: "banishment",
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "foy5mdrVCR-a2",
          kind: "triggered",
          text: "Whenever this card is banished from your memory, put a charge counter on it.",
          trigger: {
            kind: "event",
            event: {
              name: "card-banished",
              actor: "controller",
              subject: {
                kind: "source",
              },
              from: "memory",
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "event-subject",
            },
            counter: {
              named: "charge",
            },
            amount: 1,
          },
        },
        {
          id: "foy5mdrVCR-a3",
          kind: "card-resolution",
          text: "Any amount of target players banish two cards from their memory. For each card banished this way, its owner draws a card into their memory. Banish Auravolt Current.",
          targets: [
            {
              id: "target-players",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "any-number",
              },
              unique: true,
              candidates: {
                kind: "player",
                players: "each-player",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "for-each-player",
                players: {
                  binding: "target-players",
                },
                bindEachAs: "affected-player",
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "banish",
                      player: {
                        binding: "affected-player",
                      },
                      selection: {
                        id: "banished-memory-cards",
                        kind: "choice",
                        declared: "resolution",
                        chooser: {
                          binding: "affected-player",
                        },
                        count: {
                          kind: "exactly",
                          amount: 2,
                        },
                        unique: true,
                        candidates: {
                          kind: "card",
                          zones: ["memory"],
                          relationship: "zone-of",
                          player: {
                            binding: "affected-player",
                          },
                        },
                      },
                    },
                    {
                      kind: "draw",
                      player: {
                        binding: "affected-player",
                      },
                      amount: 2,
                      to: "memory",
                    },
                  ],
                },
              },
              {
                kind: "banish-object",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default auravoltCurrent;
