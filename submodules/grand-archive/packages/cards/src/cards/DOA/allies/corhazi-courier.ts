import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const corhaziCourier: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "YqQsXwEvv5",
  slug: "corhazi-courier",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "YqQsXwEvv5:face:default",
      catalogId: "YqQsXwEvv5",
      name: "Corhazi Courier",
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
        life: 2,
      },
      rulesText:
        "Stealth (This unit can't be targeted by attacks unless permitted by true sight.)\n\n[Class Bonus] On Hit: Draw a card, then discard a card. If a fire element card was discarded, choose a unit and deal 1 damage to it.",
      abilities: [
        {
          id: "YqQsXwEvv5-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Stealth (This unit can't be targeted by attacks unless permitted by true sight.)",
          keyword: {
            name: "stealth",
          },
        },
        {
          id: "YqQsXwEvv5-a2",
          kind: "triggered",
          text: "[Class Bonus] On Hit: Draw a card, then discard a card. If a fire element card was discarded, choose a unit and deal 1 damage to it.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
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
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "discard",
                player: "controller",
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
                    zones: ["hand"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
                bindResultAs: "discarded-card",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "discarded-card",
                  },
                  filter: {
                    kind: "element",
                    oneOf: ["FIRE"],
                  },
                },
                then: {
                  kind: "choose",
                  selection: {
                    id: "target-1",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                    },
                  },
                  effect: {
                    kind: "deal-damage",
                    source: {
                      kind: "source",
                    },
                    recipient: {
                      kind: "bound",
                      binding: "target-1",
                    },
                    amount: 1,
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

export default corhaziCourier;
