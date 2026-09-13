import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const overlappingVisages: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "PYAnl70edq",
  slug: "overlapping-visages",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "PYAnl70edq:face:default",
      catalogId: "PYAnl70edq",
      name: "Overlapping Visages",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Each player sacrifices an ally. If at least one non-Distortion ally and at least one Distortion ally were sacrificed this way, you summon a Lost Being token.",
      abilities: [
        {
          id: "PYAnl70edq-a1",
          kind: "card-resolution",
          text: "Each player sacrifices an ally. If at least one non-Distortion ally and at least one Distortion ally were sacrificed this way, you summon a Lost Being token.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "for-each-player",
                players: "each-player",
                bindEachAs: "sacrificing-player",
                effect: {
                  kind: "choose",
                  selection: {
                    id: "sacrificed-ally",
                    kind: "choice",
                    declared: "resolution",
                    chooser: {
                      binding: "sacrificing-player",
                    },
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      relationship: "controlled-by",
                      player: {
                        binding: "sacrificing-player",
                      },
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                    },
                  },
                  effect: {
                    kind: "sacrifice",
                    subject: {
                      kind: "bound",
                      binding: "sacrificed-ally",
                    },
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "all",
                  conditions: [
                    {
                      kind: "history",
                      event: "object-sacrificed",
                      window: "this-resolution",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ALLY"],
                          },
                          {
                            kind: "not",
                            filter: {
                              kind: "subtype",
                              oneOf: ["DISTORTION"],
                            },
                          },
                        ],
                      },
                      minimum: 1,
                    },
                    {
                      kind: "history",
                      event: "object-sacrificed",
                      window: "this-resolution",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ALLY"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["DISTORTION"],
                          },
                        ],
                      },
                      minimum: 1,
                    },
                  ],
                },
                then: {
                  kind: "summon",
                  controller: "controller",
                  object: "Lost Being",
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

export default overlappingVisages;
