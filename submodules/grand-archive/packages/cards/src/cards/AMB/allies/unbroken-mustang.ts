import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const unbrokenMustang: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ye9jkvfo0x",
  slug: "unbroken-mustang",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ye9jkvfo0x:face:default",
      catalogId: "ye9jkvfo0x",
      name: "Unbroken Mustang",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "HORSE"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "On Enter: Destroy up to one target item or weapon with memory cost 0 or reserve cost 3 or less.",
      abilities: [
        {
          id: "ye9jkvfo0x-a1",
          kind: "triggered",
          text: "On Enter: Destroy up to one target item or weapon with memory cost 0 or reserve cost 3 or less.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
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
          },
        },
      ],
    },
  },
};

export default unbrokenMustang;
