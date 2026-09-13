import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const soothingDisillusion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "geq18a4f2h",
  slug: "soothing-disillusion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "geq18a4f2h:face:default",
      catalogId: "geq18a4f2h",
      name: "Soothing Disillusion",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "TAMER"],
        subtypes: ["CLERIC", "TAMER", "SPELL"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "Choose one—\n• Destroy target phantasia.\n• Put a buff counter on target Animal or Beast ally.",
      abilities: [
        {
          id: "geq18a4f2h-a1",
          kind: "card-resolution",
          text: "Choose one—\n• Destroy target phantasia.\n• Put a buff counter on target Animal or Beast ally.",
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            modes: [
              {
                id: "mode-1",
                text: "Destroy target phantasia.",
                targets: [
                  {
                    id: "target-1",
                    kind: "target",
                    declared: "announcement",
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
                        oneOf: ["PHANTASIA"],
                      },
                    },
                  },
                ],
                effect: {
                  kind: "destroy",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  bindResultAs: "destroyed-object",
                },
              },
              {
                id: "mode-2",
                text: "Put a buff counter on target Animal or Beast ally",
                targets: [
                  {
                    id: "target-1",
                    kind: "target",
                    declared: "announcement",
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
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ALLY"],
                          },
                          {
                            kind: "any",
                            filters: [
                              {
                                kind: "subtype",
                                oneOf: ["ANIMAL"],
                              },
                              {
                                kind: "subtype",
                                oneOf: ["BEAST"],
                              },
                            ],
                          },
                        ],
                      },
                    },
                  },
                ],
                effect: {
                  kind: "add-counter",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  counter: "buff",
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default soothingDisillusion;
