import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tributeSinger: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ne6qXGbr4c",
  slug: "tribute-singer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ne6qXGbr4c:face:default",
      catalogId: "ne6qXGbr4c",
      name: "Tribute Singer",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "RESONATOR", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Level 1+] On Enter: Reveal the top five cards of your deck. You may activate a non-advanced element Harmony or Melody card from among the revealed cards or your memory. That card costs (3) less to activate this way. Put the rest of the revealed cards on the bottom of your deck in any order.",
      abilities: [
        {
          id: "ne6qXGbr4c-a1",
          kind: "triggered",
          text: "[Level 1+] On Enter: Reveal the top five cards of your deck. You may activate a non-advanced element Harmony or Melody card from among the revealed cards or your memory. That card costs (3) less to activate this way. Put the rest of the revealed cards on the bottom of your deck in any order.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
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
                  right: 1,
                },
              },
            },
          ],
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
                    amount: 5,
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
                kind: "choose",
                selection: {
                  id: "activated-harmony-or-melody",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "union",
                    sources: [
                      {
                        kind: "card",
                        binding: "revealed-cards",
                        filter: {
                          kind: "all",
                          filters: [
                            {
                              kind: "element-category",
                              value: "non-advanced",
                            },
                            {
                              kind: "any",
                              filters: [
                                {
                                  kind: "subtype",
                                  oneOf: ["HARMONY"],
                                },
                                {
                                  kind: "subtype",
                                  oneOf: ["MELODY"],
                                },
                              ],
                            },
                          ],
                        },
                      },
                      {
                        kind: "card",
                        zones: ["memory"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "all",
                          filters: [
                            {
                              kind: "element-category",
                              value: "non-advanced",
                            },
                            {
                              kind: "any",
                              filters: [
                                {
                                  kind: "subtype",
                                  oneOf: ["HARMONY"],
                                },
                                {
                                  kind: "subtype",
                                  oneOf: ["MELODY"],
                                },
                              ],
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                effect: {
                  kind: "activate-card",
                  subject: {
                    kind: "bound",
                    binding: "activated-harmony-or-melody",
                  },
                  costModifiers: [
                    {
                      operation: "subtract",
                      amount: 3,
                    },
                  ],
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "binding-remainder",
                  binding: "revealed-cards",
                  excluding: "activated-harmony-or-melody",
                },
                from: "main-deck",
                destination: {
                  zone: "main-deck",
                  placement: {
                    kind: "bottom",
                    orderChosenBy: "controller",
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

export default tributeSinger;
