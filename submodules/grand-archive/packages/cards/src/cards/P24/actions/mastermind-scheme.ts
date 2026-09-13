import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mastermindScheme: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9lbewemius",
  slug: "mastermind-scheme",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9lbewemius:face:default",
      catalogId: "9lbewemius",
      name: "Mastermind Scheme",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] Efficiency (This card costs LV less to activate. LV refers to your champion's level.)\n\nDouble the amount of preparation counters on your champion. Then if there are eight or more preparation counters on your champion, you gain agility 3 for this turn.",
      abilities: [
        {
          id: "9lbewemius-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Efficiency (This card costs LV less to activate. LV refers to your champion's level.)",
          keyword: {
            name: "efficiency",
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
          id: "9lbewemius-a2",
          kind: "card-resolution",
          text: "Double the amount of preparation counters on your champion. Then if there are eight or more preparation counters on your champion, you gain agility 3 for this turn.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "preparation",
                amount: {
                  kind: "counter-count",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: "preparation",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "has-counter",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: "preparation",
                  comparison: {
                    left: {
                      kind: "counter-count",
                      subject: {
                        kind: "champion",
                        player: "controller",
                      },
                      counter: "preparation",
                    },
                    operator: "gte",
                    right: 8,
                  },
                },
                then: {
                  kind: "set-player-state",
                  player: "controller",
                  state: "agility",
                  value: true,
                  amount: 3,
                  duration: {
                    kind: "this-turn",
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

export default mastermindScheme;
