import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rapidCombustion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0s6solta0h",
  slug: "rapid-combustion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0s6solta0h:face:default",
      catalogId: "0s6solta0h",
      name: "Rapid Combustion",
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
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Kindle 4 (You may banish up to four fire element cards from your graveyard as you activate this card. Each one pays for (1) of this card's cost.) \n\nDestroy target item or weapon with memory cost 0 or reserve cost 3 or less that entered the field this turn.",
      abilities: [
        {
          id: "0s6solta0h-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Kindle 4 (You may banish up to four fire element cards from your graveyard as you activate this card. Each one pays for (1) of this card's cost.)",
          keyword: {
            name: "kindle",
            value: 4,
          },
        },
        {
          id: "0s6solta0h-a2",
          kind: "card-resolution",
          text: "Destroy target item or weapon with memory cost 0 or reserve cost 3 or less that entered the field this turn.",
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
                      oneOf: ["ITEM", "WEAPON"],
                    },
                    {
                      kind: "any",
                      filters: [
                        {
                          kind: "numeric",
                          comparison: {
                            left: {
                              kind: "property",
                              subject: {
                                kind: "candidate",
                              },
                              property: "memory-cost",
                              basis: "base",
                            },
                            operator: "lte",
                            right: 0,
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
                  ],
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
      ],
    },
  },
};

export default rapidCombustion;
