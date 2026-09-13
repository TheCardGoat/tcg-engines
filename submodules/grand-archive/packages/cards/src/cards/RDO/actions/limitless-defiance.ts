import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const limitlessDefiance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9gRhhR0bGR",
  slug: "limitless-defiance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9gRhhR0bGR:face:default",
      catalogId: "9gRhhR0bGR",
      name: "Limitless Defiance",
      cost: {
        kind: "reserve",
        amount: 12,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "ULTIMATE", "SKILL"],
      },
      elements: ["EXIA"],
      speed: "slow",
      stats: {},
      rulesText:
        "For each damage counter on your champion, banish the top card of your deck.\n\n[Jin Bonus] Until end of turn, you may activate Warrior action and Warrior attack cards banished this way without paying their reserve cost. When you do, wake up your champion. ",
      abilities: [
        {
          id: "9gRhhR0bGR-a1",
          kind: "card-resolution",
          text: "For each damage counter on your champion, banish the top card of your deck.",
          effect: {
            kind: "repeat",
            count: {
              kind: "counter-count",
              subject: {
                kind: "champion",
                player: "controller",
              },
              counter: "damage",
            },
            effect: {
              kind: "banish",
              player: "controller",
              selection: {
                id: "referenced-cards",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                candidates: {
                  kind: "card",
                  zones: ["main-deck"],
                  relationship: "zone-of",
                  player: "controller",
                  fromTop: true,
                },
              },
            },
          },
        },
        {
          id: "9gRhhR0bGR-a2",
          kind: "card-resolution",
          text: "[Jin Bonus] Until end of turn, you may activate Warrior action and Warrior attack cards banished this way without paying their reserve cost. When you do, wake up your champion.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Jin",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "rule-modification",
                mode: "allow",
                action: "activate",
                subject: {
                  kind: "each",
                  collection: {
                    zones: ["banishment"],
                    host: {
                      kind: "source",
                    },
                    relationship: "banished-by",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "class",
                          oneOf: ["WARRIOR"],
                        },
                        {
                          kind: "type",
                          oneOf: ["ACTION", "ATTACK"],
                        },
                      ],
                    },
                  },
                },
                fromZone: "banishment",
                activationResult: {
                  afterResolution: {
                    kind: "wake",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                  },
                },
                duration: {
                  kind: "this-turn",
                },
              },
              {
                kind: "rule-modification",
                mode: "replace-cost",
                action: "activate",
                subject: {
                  kind: "each",
                  collection: {
                    zones: ["banishment"],
                    host: {
                      kind: "source",
                    },
                    relationship: "banished-by",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "class",
                          oneOf: ["WARRIOR"],
                        },
                        {
                          kind: "type",
                          oneOf: ["ACTION", "ATTACK"],
                        },
                      ],
                    },
                  },
                },
                fromZone: "banishment",
                costKind: "reserve",
                cost: {
                  kind: "pay-reserve",
                  amount: 0,
                },
                duration: {
                  kind: "this-turn",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default limitlessDefiance;
