import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const assembleTheAncients: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "moi0a5uhjx",
  slug: "assemble-the-ancients",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "moi0a5uhjx:face:default",
      catalogId: "moi0a5uhjx",
      name: "Assemble the Ancients",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["NEOS"],
      speed: "slow",
      stats: {},
      rulesText:
        "Sacrifice any number of domains then summon that many Automaton Drone tokens. Each of those tokens enters the field rested with an amount of buff counters on it equal to the amount of domains sacrificed this way. Then they gain vigor until end of turn.",
      abilities: [
        {
          id: "moi0a5uhjx-a1",
          kind: "card-resolution",
          text: "Sacrifice any number of domains then summon that many Automaton Drone tokens. Each of those tokens enters the field rested with an amount of buff counters on it equal to the amount of domains sacrificed this way. Then they gain vigor until end of turn.",
          effect: {
            kind: "choose",
            selection: {
              id: "sacrificed-domains",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "any-number",
              },
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["DOMAIN"],
                },
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "sacrifice",
                  subject: {
                    kind: "bound",
                    binding: "sacrificed-domains",
                  },
                  bindResultAs: "sacrificed-domains-result",
                },
                {
                  kind: "summon",
                  controller: "controller",
                  object: "Automaton Drone",
                  amount: {
                    kind: "modified-ability-result-amount",
                    metric: "objects-sacrificed",
                  },
                  entersWithStates: ["rested"],
                  entersWithCounters: [
                    {
                      counter: "buff",
                      amount: {
                        kind: "modified-ability-result-amount",
                        metric: "objects-sacrificed",
                      },
                    },
                  ],
                  bindResultAs: "summoned-drones",
                },
                {
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "summoned-drones",
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
                      name: "vigor",
                    },
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

export default assembleTheAncients;
