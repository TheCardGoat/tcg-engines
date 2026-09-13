import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spurnToAsh: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ErH0lIBq4z",
  slug: "spurn-to-ash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ErH0lIBq4z:face:default",
      catalogId: "ErH0lIBq4z",
      name: "Spurn to Ash",
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
      rulesText: "Destroy target regalia with memory cost 1 or less.",
      abilities: [
        {
          id: "ErH0lIBq4z-a1",
          kind: "card-resolution",
          text: "Destroy target regalia with memory cost 1 or less.",
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
                      kind: "supertype",
                      oneOf: ["REGALIA"],
                    },
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
                        right: 1,
                      },
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

export default spurnToAsh;
