import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const thermalBreak: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "QJHpGP4kpe",
  slug: "thermal-break",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "QJHpGP4kpe:face:default",
      catalogId: "QJHpGP4kpe",
      name: "Thermal Break",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Destroy target item or weapon with memory cost 0 or reserve cost 3 or less. If that object was linked to a unit, deal 3 damage to that unit.",
      abilities: [
        {
          id: "QJHpGP4kpe-a1",
          kind: "card-resolution",
          text: "Destroy target item or weapon with memory cost 0 or reserve cost 3 or less. If that object was linked to a unit, deal 3 damage to that unit.",
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
            kind: "sequence",
            effects: [
              {
                kind: "destroy",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                bindResultAs: "destroyed-object",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "has-related-object",
                  subject: {
                    kind: "tracked",
                    key: "destroyed-object",
                  },
                  relation: "host",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY", "CHAMPION"],
                  },
                },
                then: {
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "related",
                    subject: {
                      kind: "tracked",
                      key: "destroyed-object",
                    },
                    relation: "host",
                  },
                  amount: 3,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default thermalBreak;
