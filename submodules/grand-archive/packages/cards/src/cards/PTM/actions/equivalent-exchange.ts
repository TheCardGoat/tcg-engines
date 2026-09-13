import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const equivalentExchange: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qvB66hupGQ",
  slug: "equivalent-exchange",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qvB66hupGQ:face:default",
      catalogId: "qvB66hupGQ",
      name: "Equivalent Exchange",
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
      speed: "slow",
      stats: {},
      rulesText:
        "Summon a Lost Being token rested. Then you may banish two ally cards from a single graveyard. If you do, wake up that token and put a buff counter on it.",
      abilities: [
        {
          id: "qvB66hupGQ-a1",
          kind: "card-resolution",
          text: "Summon a Lost Being token rested. Then you may banish two ally cards from a single graveyard. If you do, wake up that token and put a buff counter on it.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "summon",
                controller: "controller",
                object: "Lost Being",
                amount: 1,
                entersWithStates: ["rested"],
                bindResultAs: "lost-being-token",
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "choose",
                  selection: {
                    id: "banished-allies",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 2,
                    },
                    unique: true,
                    singleZoneOwner: true,
                    candidates: {
                      kind: "card",
                      zones: ["graveyard"],
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                    },
                  },
                  effect: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "banish",
                        player: "controller",
                        selection: {
                          id: "banished-allies",
                          kind: "choice",
                          declared: "resolution",
                          chooser: "controller",
                          count: {
                            kind: "exactly",
                            amount: 2,
                          },
                          unique: true,
                          singleZoneOwner: true,
                          candidates: {
                            kind: "card",
                            zones: ["graveyard"],
                            filter: {
                              kind: "type",
                              oneOf: ["ALLY"],
                            },
                          },
                        },
                      },
                      {
                        kind: "wake",
                        subject: {
                          kind: "bound",
                          binding: "lost-being-token",
                        },
                      },
                      {
                        kind: "add-counter",
                        subject: {
                          kind: "bound",
                          binding: "lost-being-token",
                        },
                        counter: "buff",
                        amount: 1,
                      },
                    ],
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

export default equivalentExchange;
