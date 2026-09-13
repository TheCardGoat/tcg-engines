import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const adventOfTheStormcaller: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ZSSegCjquB",
  slug: "advent-of-the-stormcaller",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ZSSegCjquB:face:default",
      catalogId: "ZSSegCjquB",
      name: "Advent of the Stormcaller",
      cost: {
        kind: "reserve",
        amount: 15,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["ARCANE"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] Efficiency\n\nReveal the top LV cards of your deck. You may banish any amount of arcane element cards from among them. For each card banished this way, choose a unit and deal 2 damage to it. Put the rest of the revealed cards on the top or on the bottom of your deck in any order.",
      abilities: [
        {
          id: "ZSSegCjquB-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Efficiency",
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
          id: "ZSSegCjquB-a2",
          kind: "card-resolution",
          text: "Reveal the top LV cards of your deck. You may banish any amount of arcane element cards from among them. For each card banished this way, choose a unit and deal 2 damage to it. Put the rest of the revealed cards on the top or on the bottom of your deck in any order.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "revealed-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: {
                      kind: "property",
                      subject: {
                        kind: "champion",
                        player: "controller",
                      },
                      property: "level",
                      basis: "current",
                    },
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
              {
                kind: "banish",
                player: "controller",
                selection: {
                  id: "banished-arcane",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "any-number",
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "revealed-cards",
                    filter: {
                      kind: "element",
                      oneOf: ["ARCANE"],
                    },
                  },
                },
              },
              {
                kind: "for-each",
                collection: {
                  binding: "banished-arcane",
                },
                bindEachAs: "banished-card",
                effect: {
                  kind: "choose",
                  selection: {
                    id: "damaged-unit",
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
                      binding: "damaged-unit",
                    },
                    amount: 2,
                  },
                },
              },
              {
                kind: "move-partition",
                subject: {
                  kind: "binding-remainder",
                  binding: "revealed-cards",
                  excluding: "banished-arcane",
                },
                chooser: "controller",
                destinations: [
                  {
                    zone: "main-deck",
                    placement: {
                      kind: "top",
                      orderChosenBy: "controller",
                    },
                  },
                  {
                    zone: "main-deck",
                    placement: {
                      kind: "bottom",
                      orderChosenBy: "controller",
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  },
};

export default adventOfTheStormcaller;
