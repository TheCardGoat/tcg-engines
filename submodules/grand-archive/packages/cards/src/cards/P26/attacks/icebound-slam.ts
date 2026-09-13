import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const iceboundSlam: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6fxxgmuesd",
  slug: "icebound-slam",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6fxxgmuesd:face:default",
      catalogId: "6fxxgmuesd",
      name: "Icebound Slam",
      cost: {
        kind: "reserve",
        amount: 7,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["WATER"],
      stats: {
        power: 3,
      },
      rulesText:
        "[Class Bonus] This card costs 2 less to activate. \n\nOn Attack: Put the top five cards of your deck into your graveyard. Then if there are five or more water element cards in your graveyard, Icebound Slam gets +5 POWER.",
      abilities: [
        {
          id: "6fxxgmuesd-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate.",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "6fxxgmuesd-a2",
          kind: "triggered",
          text: "On Attack: Put the top five cards of your deck into your graveyard. Then if there are five or more water element cards in your graveyard, Icebound Slam gets +5 POWER.",
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
                kind: "mill",
                player: "controller",
                amount: 5,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "count",
                      collection: {
                        zones: ["graveyard"],
                        player: "controller",
                        filter: {
                          kind: "element",
                          oneOf: ["WATER"],
                        },
                      },
                    },
                    operator: "gte",
                    right: 5,
                  },
                },
                then: {
                  kind: "continuous",
                  subjects: {
                    kind: "source",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "permanent",
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
                    amount: 5,
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

export default iceboundSlam;
