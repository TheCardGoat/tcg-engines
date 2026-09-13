import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const geniGiftedMechanist: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wuir99sx6q",
  slug: "geni-gifted-mechanist",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wuir99sx6q:face:default",
      catalogId: "wuir99sx6q",
      name: "Geni, Gifted Mechanist",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "(2),REST, Banish a card from your graveyard: If the banished card was an Automaton ally card, summon an Automaton Drone token. Then if the banished card had floating memory, put two buff counters on an Automaton ally you control.",
      abilities: [
        {
          id: "wuir99sx6q-a1",
          kind: "activated",
          text: "(2),REST, Banish a card from your graveyard: If the banished card was an Automaton ally card, summon an Automaton Drone token. Then if the banished card had floating memory, put two buff counters on an Automaton ally you control.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "select-and-move",
                player: "controller",
                from: "graveyard",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                bindResultAs: "banished-card",
              },
            ],
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "banished-card",
                  },
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
                then: {
                  kind: "summon",
                  controller: "controller",
                  object: "Automaton Drone",
                  amount: 1,
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "banished-card",
                  },
                  filter: {
                    kind: "has-keyword",
                    keyword: "floating-memory",
                  },
                },
                then: {
                  kind: "choose",
                  selection: {
                    id: "automaton-ally",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      relationship: "controlled-by",
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
                  effect: {
                    kind: "add-counter",
                    subject: {
                      kind: "bound",
                      binding: "automaton-ally",
                    },
                    counter: "buff",
                    amount: 2,
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

export default geniGiftedMechanist;
