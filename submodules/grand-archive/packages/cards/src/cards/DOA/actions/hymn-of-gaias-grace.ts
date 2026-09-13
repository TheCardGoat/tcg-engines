import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hymnOfGaiasGrace: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "okDVkV1l76",
  slug: "hymn-of-gaias-grace",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "okDVkV1l76:face:default",
      catalogId: "okDVkV1l76",
      name: "Hymn of Gaia's Grace",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL", "MELODY"],
      },
      elements: ["TERA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Glimpse 3. Draw a card.\n\nYou may put an Animal or Beast ally card with reserve cost LV or less from your hand onto the field. If you do, you may change the target of an attack that targets your champion to that ally.",
      abilities: [
        {
          id: "okDVkV1l76-a1",
          kind: "card-resolution",
          text: "Glimpse 3. Draw a card.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: 3,
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
            ],
          },
        },
        {
          id: "okDVkV1l76-a2",
          kind: "card-resolution",
          text: "You may put an Animal or Beast ally card with reserve cost LV or less from your hand onto the field. If you do, you may change the target of an attack that targets your champion to that ally.",
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "choose",
              selection: {
                id: "animal-or-beast",
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
                          right: {
                            kind: "property",
                            subject: {
                              kind: "champion",
                              player: "controller",
                            },
                            property: "level",
                            basis: "current",
                          },
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
                      binding: "animal-or-beast",
                    },
                    from: "hand",
                    destination: {
                      zone: "field",
                    },
                  },
                  {
                    kind: "conditional",
                    condition: {
                      kind: "current-attack-target-matches",
                      controller: "controller",
                      filter: {
                        kind: "type",
                        oneOf: ["CHAMPION"],
                      },
                    },
                    then: {
                      kind: "optional",
                      player: "controller",
                      allOrNothing: true,
                      effect: {
                        kind: "retarget",
                        subject: {
                          kind: "current-attack",
                        },
                        chooser: "controller",
                        newTarget: {
                          kind: "bound",
                          binding: "animal-or-beast",
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
};

export default hymnOfGaiasGrace;
