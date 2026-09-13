import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const captainArcher: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "disqw3d0o5",
  slug: "captain-archer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "disqw3d0o5:face:default",
      catalogId: "disqw3d0o5",
      name: "Captain Archer",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "Imbue 4\n\n[Class Bonus] On Enter: If Captain Archer is imbued, look at the top six cards of your deck. You may put a wind element ally card with reserve cost 3 or less from among them onto the field distant. Put the rest on the bottom of your deck in any order.",
      abilities: [
        {
          id: "disqw3d0o5-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Imbue 4",
          keyword: {
            name: "imbue",
            value: 4,
            elementRequirement: "source-elements",
          },
        },
        {
          id: "disqw3d0o5-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: If Captain Archer is imbued, look at the top six cards of your deck. You may put a wind element ally card with reserve cost 3 or less from among them onto the field distant. Put the rest on the bottom of your deck in any order.",
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
                kind: "conditional",
                condition: {
                  kind: "activation-state",
                  state: "imbued",
                },
                then: {
                  kind: "look-at",
                  player: "controller",
                  selection: {
                    id: "referenced-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 6,
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
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "choose",
                  selection: {
                    id: "selected-referenced-card",
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
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "element",
                            oneOf: ["WIND"],
                          },
                          {
                            kind: "type",
                            oneOf: ["ALLY"],
                          },
                          {
                            kind: "numeric",
                            comparison: {
                              left: {
                                kind: "property",
                                subject: {
                                  kind: "candidate",
                                },
                                property: "reserve-cost",
                                basis: "base",
                              },
                              operator: "lte",
                              right: 3,
                            },
                          },
                        ],
                      },
                    },
                  },
                  effect: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "move",
                        subject: {
                          kind: "bound",
                          binding: "selected-referenced-card",
                        },
                        destination: {
                          zone: "field",
                        },
                      },
                      {
                        kind: "set-object-state",
                        subject: {
                          kind: "bound",
                          binding: "selected-referenced-card",
                        },
                        state: "distant",
                        value: true,
                      },
                    ],
                  },
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "binding-remainder",
                  binding: "referenced-cards",
                  excluding: "selected-referenced-card",
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
      ],
    },
  },
};

export default captainArcher;
