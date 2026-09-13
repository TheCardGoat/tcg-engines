import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const naturesAppeal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "oj0oh7pjoq",
  slug: "natures-appeal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "oj0oh7pjoq:face:default",
      catalogId: "oj0oh7pjoq",
      name: "Nature's Appeal",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["TERA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Reveal the top LV cards of your deck. Put one of those cards into your hand and another into your material deck preserved. Put the rest on the bottom of your deck in any order. (As you materialize, you may instead return a preserved card to your hand.)",
      abilities: [
        {
          id: "oj0oh7pjoq-a1",
          kind: "card-resolution",
          text: "Reveal the top LV cards of your deck. Put one of those cards into your hand and another into your material deck preserved. Put the rest on the bottom of your deck in any order. (As you materialize, you may instead return a preserved card to your hand.)",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "referenced-cards",
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
                kind: "choose",
                selection: {
                  id: "referenced-card-to-hand",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "referenced-cards",
                  },
                },
                effect: {
                  kind: "choose",
                  selection: {
                    id: "referenced-card-to-material-deck",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "card",
                      binding: "referenced-cards",
                      excluding: ["referenced-card-to-hand"],
                    },
                  },
                  effect: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "move",
                        subject: {
                          kind: "bound",
                          binding: "referenced-card-to-hand",
                        },
                        destination: {
                          zone: "hand",
                        },
                      },
                      {
                        kind: "move",
                        subject: {
                          kind: "bound",
                          binding: "referenced-card-to-material-deck",
                        },
                        destination: {
                          zone: "material-deck",
                        },
                      },
                      {
                        kind: "set-object-state",
                        subject: {
                          kind: "bound",
                          binding: "referenced-card-to-material-deck",
                        },
                        state: "preserved",
                        value: true,
                      },
                      {
                        kind: "move",
                        subject: {
                          kind: "binding-remainder",
                          binding: "referenced-cards",
                          excluding: [
                            "referenced-card-to-hand",
                            "referenced-card-to-material-deck",
                          ],
                        },
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
              },
            ],
          },
        },
      ],
    },
  },
};

export default naturesAppeal;
