import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const creativeShock: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "BqDw4Mei4C",
  slug: "creative-shock",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "BqDw4Mei4C:face:default",
      catalogId: "BqDw4Mei4C",
      name: "Creative Shock",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Draw two cards, then discard a card.\nClass Bonus: If a fire element card was discarded, you may choose a unit and deal 2 damage to it. (Apply the additional effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "BqDw4Mei4C-a1",
          kind: "card-resolution",
          text: "Draw two cards, then discard a card.\nClass Bonus: If a fire element card was discarded, you may choose a unit and deal 2 damage to it. (Apply the additional effect only if your champion's class matches this card's class.)",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 2,
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
                  kind: "all",
                  conditions: [
                    {
                      kind: "champion-matches-source",
                      characteristic: "class",
                    },
                    {
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
                  ],
                },
                then: {
                  kind: "optional",
                  player: "controller",
                  allOrNothing: true,
                  effect: {
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
                      amount: 2,
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
};

export default creativeShock;
