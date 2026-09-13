import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const steadySharpshooter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yakyp6odw3",
  slug: "steady-sharpshooter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yakyp6odw3:face:default",
      catalogId: "yakyp6odw3",
      name: "Steady Sharpshooter",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "On Attack: Put an aim counter on Steady Sharpshooter. Then you may remove all aim counters from Steady Sharpshooter. For each counter removed this way, Steady Sharpshooter gains ranged 2 for this attack.",
      abilities: [
        {
          id: "yakyp6odw3-a1",
          kind: "triggered",
          text: "On Attack: Put an aim counter on Steady Sharpshooter. Then you may remove all aim counters from Steady Sharpshooter. For each counter removed this way, Steady Sharpshooter gains ranged 2 for this attack.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "aim",
                },
                amount: 1,
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "remove-counter",
                      subject: {
                        kind: "source",
                      },
                      counter: {
                        named: "aim",
                      },
                      amount: {
                        kind: "all",
                      },
                      bindResultAs: "removed-aim-count",
                    },
                    {
                      kind: "repeat",
                      count: {
                        kind: "binding",
                        binding: "removed-aim-count",
                      },
                      effect: {
                        kind: "continuous",
                        subjects: {
                          kind: "source",
                        },
                        affectedSet: "locked",
                        duration: {
                          kind: "this-attack",
                        },
                        layer: {
                          layer: "D",
                          modifies: "ability",
                        },
                        change: {
                          kind: "grant-keyword",
                          keyword: {
                            name: "ranged",
                            value: 2,
                          },
                        },
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

export default steadySharpshooter;
