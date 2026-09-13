import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const slimeEruption: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "m3zkl7lpvn",
  slug: "slime-eruption",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "m3zkl7lpvn:face:default",
      catalogId: "m3zkl7lpvn",
      name: "Slime Eruption",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SLIME", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "You may banish any amount of fire element Slime ally cards and up to two non-fire element Slime ally cards from your graveyard. For each card banished this way, choose a unit and deal 1 damage to it.\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "m3zkl7lpvn-a1",
          kind: "card-resolution",
          text: "You may banish any amount of fire element Slime ally cards and up to two non-fire element Slime ally cards from your graveyard. For each card banished this way, choose a unit and deal 1 damage to it.",
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
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
                      kind: "any-number",
                    },
                    candidates: {
                      kind: "card",
                      zones: ["graveyard"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "not",
                            filter: {
                              kind: "element",
                              oneOf: ["FIRE"],
                            },
                          },
                          {
                            kind: "type",
                            oneOf: ["ALLY"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["SLIME"],
                          },
                        ],
                      },
                    },
                  },
                },
                {
                  kind: "for-each",
                  collection: {
                    binding: "banished-cards",
                  },
                  bindEachAs: "that-card",
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
                      amount: 1,
                    },
                  },
                },
              ],
            },
          },
        },
        {
          id: "m3zkl7lpvn-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
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
      ],
    },
  },
};

export default slimeEruption;
