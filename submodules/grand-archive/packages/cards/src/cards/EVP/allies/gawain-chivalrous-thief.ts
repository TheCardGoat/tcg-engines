import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gawainChivalrousThief: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "du50pcescf",
  slug: "gawain-chivalrous-thief",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "du50pcescf:face:default",
      catalogId: "du50pcescf",
      name: "Gawain, Chivalrous Thief",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["ASSASSIN", "RANGER"],
        subtypes: ["ASSASSIN", "RANGER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "[Level 2+] True Sight\n\n[Class Bonus] On Champion Hit: You may sacrifice Gawain. If you do, look at that opponent's memory and discard a card from it.",
      abilities: [
        {
          id: "du50pcescf-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Level 2+] True Sight",
          keyword: {
            name: "true-sight",
          },
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
        },
        {
          id: "du50pcescf-a2",
          kind: "triggered",
          text: "[Class Bonus] On Champion Hit: You may sacrifice Gawain. If you do, look at that opponent's memory and discard a card from it.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "sacrifice",
                  subject: {
                    kind: "source",
                  },
                },
                {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "look-at",
                      player: "controller",
                      selection: {
                        id: "looked-at-memory",
                        kind: "choice",
                        declared: "resolution",
                        chooser: "controller",
                        count: {
                          kind: "all",
                        },
                        candidates: {
                          kind: "card",
                          zones: ["memory"],
                          relationship: "zone-of",
                          player: "event-recipient-controller",
                        },
                      },
                    },
                    {
                      kind: "choose",
                      selection: {
                        id: "discarded-card",
                        kind: "choice",
                        declared: "resolution",
                        chooser: "controller",
                        count: {
                          kind: "exactly",
                          amount: 1,
                        },
                        candidates: {
                          kind: "card",
                          zones: ["memory"],
                          relationship: "zone-of",
                          player: "event-recipient-controller",
                        },
                      },
                      effect: {
                        kind: "discard-object",
                        subject: {
                          kind: "bound",
                          binding: "discarded-card",
                        },
                      },
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default gawainChivalrousThief;
