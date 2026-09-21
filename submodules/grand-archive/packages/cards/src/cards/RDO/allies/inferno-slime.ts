import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const infernoSlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2vQVsdHJqI",
  slug: "inferno-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2vQVsdHJqI:face:default",
      catalogId: "2vQVsdHJqI",
      name: "Inferno Slime",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "SLIME"],
      },
      elements: ["FIRE"],
      stats: {
        power: 3,
        life: 3,
      },
      rulesText:
        "Pride 2 (This ally won’t obey you unless your champion is level 2 or higher. You can’t attack with, intercept with, or activate abilities of allies that don’t obey you.)\n\n[Class Bonus] On Death: You may banish two fire element cards from your graveyard. If you do, deal 4 damage to each champion.",
      abilities: [
        {
          id: "2vQVsdHJqI-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 2 (This ally won’t obey you unless your champion is level 2 or higher. You can’t attack with, intercept with, or activate abilities of allies that don’t obey you.)",
          keyword: {
            name: "pride",
            value: 2,
          },
        },
        {
          id: "2vQVsdHJqI-a2",
          kind: "triggered",
          text: "[Class Bonus] On Death: You may banish two fire element cards from your graveyard. If you do, deal 4 damage to each champion.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
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
                        zones: ["graveyard"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "element",
                          oneOf: ["FIRE"],
                        },
                      },
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "deal-damage",
                    source: {
                      kind: "source",
                    },
                    recipient: {
                      kind: "each",
                      collection: {
                        zones: ["field"],
                        filter: {
                          kind: "type",
                          oneOf: ["CHAMPION"],
                        },
                      },
                    },
                    amount: 4,
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

export default infernoSlime;
