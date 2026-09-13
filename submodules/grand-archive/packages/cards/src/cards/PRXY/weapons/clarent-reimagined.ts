import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const clarentReimagined: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "kINobk9KQA",
  slug: "clarent-reimagined",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "kINobk9KQA:face:default",
      catalogId: "kINobk9KQA",
      name: "Clarent, Reimagined",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 3,
      },
      rulesText:
        "[Lorraine Bonus] While paying for this card's memory cost, you may banish a card named Clarent, Sword of Peace and up to one other Sword Regalia card from your material deck. Each card banished this way pays for 1 of that cost.\n\n[Lorraine Bonus] Remove a durability counter from Clarent: If target unit would be dealt non-combat damage this turn, prevent 1 of that damage. Clarent gains spellshroud until end of turn.",
      abilities: [
        {
          id: "kINobk9KQA-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Lorraine Bonus] While paying for this card's memory cost, you may banish a card named Clarent, Sword of Peace and up to one other Sword Regalia card from your material deck. Each card banished this way pays for 1 of that cost.",
          functionalZones: ["material-deck"],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Lorraine",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "payment-contribution",
              action: "pay-cost",
              subject: {
                kind: "source",
              },
              costKind: "memory",
              cost: {
                kind: "all",
                costs: [
                  {
                    kind: "select-and-move",
                    player: "controller",
                    from: "material-deck",
                    to: "banishment",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    filter: {
                      kind: "name",
                      value: "Clarent, Sword of Peace",
                    },
                    bindResultAs: "clarent-payment-card",
                  },
                  {
                    kind: "select-and-move",
                    player: "controller",
                    from: "material-deck",
                    to: "banishment",
                    count: {
                      kind: "up-to",
                      amount: 1,
                    },
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "supertype",
                          oneOf: ["REGALIA"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["SWORD"],
                        },
                        {
                          kind: "not-subject",
                          subject: {
                            kind: "bound",
                            binding: "clarent-payment-card",
                          },
                        },
                      ],
                    },
                  },
                ],
              },
              amount: 1,
              contributionBasis: "per-paid-object",
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "kINobk9KQA-a2",
          kind: "card-resolution",
          text: "[Lorraine Bonus] Remove a durability counter from Clarent: If target unit would be dealt non-combat damage this turn, prevent 1 of that damage. Clarent gains spellshroud until end of turn.",
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
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Lorraine",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "remove-counter",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: "durability",
                amount: 1,
                bindResultAs: "removed-counters",
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "source",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-keyword",
                  keyword: {
                    name: "spellshroud",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default clarentReimagined;
