import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const desperateCavalier: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "slmer06rku",
  slug: "desperate-cavalier",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "slmer06rku:face:default",
      catalogId: "slmer06rku",
      name: "Desperate Cavalier",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["EXIA"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Attack: If your influence is four or less, banish the top two cards of your deck. As long as they're banished you may activate them. As an additional cost to activate each of those cards, deal 2 unpreventable damage to your champion.",
      abilities: [
        {
          id: "slmer06rku-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: If your influence is four or less, banish the top two cards of your deck. As long as they're banished you may activate them. As an additional cost to activate each of those cards, deal 2 unpreventable damage to your champion.",
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
            kind: "conditional",
            condition: {
              kind: "player-property-compare",
              players: "controller",
              quantifier: "all",
              property: "influence",
              operator: "lte",
              value: 4,
            },
            then: {
              kind: "sequence",
              effects: [
                {
                  kind: "banish",
                  player: "controller",
                  selection: {
                    id: "banished-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 2,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["main-deck"],
                      relationship: "zone-of",
                      player: "controller",
                      fromTop: true,
                    },
                  },
                  bindResultAs: "banished-cards",
                },
                {
                  kind: "rule-modification",
                  mode: "allow",
                  action: "activate",
                  subject: {
                    kind: "bound",
                    binding: "banished-cards",
                  },
                  fromZone: "banishment",
                  duration: {
                    kind: "while-subjects-in-zone",
                    subjects: {
                      kind: "bound",
                      binding: "banished-cards",
                    },
                    zone: "banishment",
                    scope: "per-object",
                  },
                },
                {
                  kind: "rule-modification",
                  mode: "add-cost",
                  action: "activate",
                  subject: {
                    kind: "bound",
                    binding: "banished-cards",
                  },
                  fromZone: "banishment",
                  cost: {
                    kind: "take-damage",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    amount: 2,
                    preventable: false,
                  },
                  duration: {
                    kind: "while-subjects-in-zone",
                    subjects: {
                      kind: "bound",
                      binding: "banished-cards",
                    },
                    zone: "banishment",
                    scope: "per-object",
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

export default desperateCavalier;
