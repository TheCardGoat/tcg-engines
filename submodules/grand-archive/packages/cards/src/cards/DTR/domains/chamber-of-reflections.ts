import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const chamberOfReflections: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pbtudivyzb",
  slug: "chamber-of-reflections",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pbtudivyzb:face:default",
      catalogId: "pbtudivyzb",
      name: "Chamber of Reflections",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "DISTORTION", "CROSSROADS"],
      },
      elements: ["ASTRA"],
      stats: {},
      rulesText:
        "Hindered (This object enters the field rested.) \n\nREST, Sacrifice Chamber of Reflections: Search your deck for a non-advanced element non-Distortion domain card with reserve cost 3 or less and put it onto the field. Then shuffle your deck.",
      abilities: [
        {
          id: "pbtudivyzb-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This object enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "pbtudivyzb-a2",
          kind: "activated",
          text: "REST, Sacrifice Chamber of Reflections: Search your deck for a non-advanced element non-Distortion domain card with reserve cost 3 or less and put it onto the field. Then shuffle your deck.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "search",
                player: "controller",
                zone: "main-deck",
                selection: {
                  id: "searched-domain",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["DOMAIN"],
                        },
                        {
                          kind: "element-category",
                          value: "non-advanced",
                        },
                        {
                          kind: "not",
                          filter: {
                            kind: "subtype",
                            oneOf: ["DISTORTION"],
                          },
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
              },
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "searched-domain",
                },
                from: "main-deck",
                destination: {
                  zone: "field",
                },
              },
              {
                kind: "shuffle",
                player: "controller",
                zone: "main-deck",
              },
            ],
          },
        },
      ],
    },
  },
};

export default chamberOfReflections;
