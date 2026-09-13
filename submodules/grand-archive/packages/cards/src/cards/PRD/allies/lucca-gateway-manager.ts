import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const luccaGatewayManager: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5JH6j7QVuG",
  slug: "lucca-gateway-manager",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5JH6j7QVuG:face:default",
      catalogId: "5JH6j7QVuG",
      name: "Lucca, Gateway Manager",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Vigor\n\nREST: Cascade— \n• 1— Put a bulwark counter on Lucca.\n• 2— Put a buff counter on Lucca.\n• 3— Put a buff counter on Lucca. Then she gains spellshroud and taunt. ",
      abilities: [
        {
          id: "5JH6j7QVuG-a1",
          kind: "triggered",
          intrinsic: true,
          text: "[Class Bonus] Vigor",
          keyword: {
            name: "vigor",
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
          id: "5JH6j7QVuG-a2",
          kind: "activated",
          text: "REST: Cascade—\n• 1— Put a bulwark counter on Lucca.\n• 2— Put a buff counter on Lucca.\n• 3— Put a buff counter on Lucca. Then she gains spellshroud and taunt.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          cascade: {
            kind: "cascade",
            advanceOn: "activation",
            tracking: {
              scope: "source-instance",
              includesCurrent: true,
              advancesIfStackEntryFailsToResolve: true,
            },
            copiedAbility: "repeat-pending-effect-without-advancing",
            modes: [
              {
                id: "cascade-1",
                text: "Put a bulwark counter on Lucca.",
                counts: [1],
                effect: {
                  kind: "add-counter",
                  subject: {
                    kind: "source",
                  },
                  counter: "bulwark",
                  amount: 1,
                },
              },
              {
                id: "cascade-2",
                text: "Put a buff counter on Lucca.",
                counts: [2],
                effect: {
                  kind: "add-counter",
                  subject: {
                    kind: "source",
                  },
                  counter: "buff",
                  amount: 1,
                },
              },
              {
                id: "cascade-3",
                text: "Put a buff counter on Lucca. Then she gains spellshroud and taunt.",
                counts: [3],
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "add-counter",
                      subject: {
                        kind: "source",
                      },
                      counter: "buff",
                      amount: 1,
                    },
                    {
                      kind: "sequence",
                      effects: [
                        {
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
                            kind: "grant-keyword",
                            keyword: {
                              name: "spellshroud",
                            },
                          },
                        },
                        {
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
                            kind: "grant-keyword",
                            keyword: {
                              name: "taunt",
                            },
                          },
                        },
                      ],
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

export default luccaGatewayManager;
