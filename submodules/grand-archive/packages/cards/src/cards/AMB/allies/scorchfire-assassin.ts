import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const scorchfireAssassin: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "o4h8cfo21a",
  slug: "scorchfire-assassin",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "o4h8cfo21a:face:default",
      catalogId: "o4h8cfo21a",
      name: "Scorchfire Assassin",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] On Attack: You may remove up to three preparation counters from your champion. For each counter removed this way, this attack gets +2 POWER. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "o4h8cfo21a-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: You may remove up to three preparation counters from your champion. For each counter removed this way, this attack gets +2 POWER. (Apply this effect only if your champion’s class matches this card’s class.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
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
                kind: "choose-value",
                trackAs: "preparation-count",
                selection: {
                  id: "preparation-count",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "number",
                    minimum: 0,
                    maximum: {
                      kind: "calculate",
                      operator: "minimum",
                      operands: [
                        3,
                        {
                          kind: "counter-count",
                          subject: {
                            kind: "champion",
                            player: "controller",
                          },
                          counter: "preparation",
                        },
                      ],
                    },
                  },
                },
              },
              {
                kind: "remove-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "preparation",
                amount: {
                  kind: "binding",
                  binding: "preparation-count",
                },
                bindResultAs: "removed-preparation-count",
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "current-attack",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-attack",
                },
                layer: {
                  layer: "E",
                  modifies: "stat",
                  sublayer: "modifier",
                },
                change: {
                  kind: "numeric",
                  property: "power",
                  operation: "add",
                  amount: {
                    kind: "calculate",
                    operator: "multiply",
                    operands: [
                      {
                        kind: "binding",
                        binding: "removed-preparation-count",
                      },
                      2,
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

export default scorchfireAssassin;
