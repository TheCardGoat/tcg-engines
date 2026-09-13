import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sinonBabeliasCompanion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "GhxADim7Kf",
  slug: "sinon-babelias-companion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "GhxADim7Kf:face:default",
      catalogId: "GhxADim7Kf",
      name: "Sinon, Babelia's Companion",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "DISCORP", "AUTOMATON"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        life: 4,
      },
      rulesText:
        "REST, Sacrifice a Powercell: Cascade— \n• 1— Draw a card.\n• 2— Put a buff counter on each Automaton ally you control.\n• 3— Wake up Sinon. Their base power becomes 4.\n(This ability changes each cascade.)",
      abilities: [
        {
          id: "GhxADim7Kf-a1",
          kind: "activated",
          text: "REST, Sacrifice a Powercell: Cascade—\n• 1— Draw a card.\n• 2— Put a buff counter on each Automaton ally you control.\n• 3— Wake up Sinon. Their base power becomes 4.\n(This ability changes each cascade.)",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                bindResultAs: "sacrificed-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["POWERCELL"],
                },
              },
            ],
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
                text: "Draw a card.",
                counts: [1],
                effect: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              },
              {
                id: "cascade-2",
                text: "Put a buff counter on each Automaton ally you control.",
                counts: [2],
                effect: {
                  kind: "add-counter",
                  subject: {
                    kind: "each",
                    collection: {
                      zones: ["field"],
                      player: "controller",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ALLY"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["AUTOMATON"],
                          },
                        ],
                      },
                    },
                  },
                  counter: "buff",
                  amount: 1,
                },
              },
              {
                id: "cascade-3",
                text: "Wake up Sinon. Their base power becomes 4.",
                counts: [3],
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "wake",
                      subject: {
                        kind: "source",
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
                        layer: "A",
                        modifies: "base-stats",
                      },
                      change: {
                        kind: "numeric",
                        property: "power",
                        operation: "set",
                        amount: 4,
                      },
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

export default sinonBabeliasCompanion;
