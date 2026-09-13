import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fluteOfTaming: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "y8fx8G64C9",
  slug: "flute-of-taming",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "y8fx8G64C9:face:default",
      catalogId: "y8fx8G64C9",
      name: "Flute of Taming",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "INSTRUMENT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "REST: Your champion gets +1 level until end of turn.\n\nREST: Target Animal or Beast ally gets your choice of +1 POWER or +1 LIFE until end of turn.",
      abilities: [
        {
          id: "y8fx8G64C9-a1",
          kind: "activated",
          text: "REST: Your champion gets +1 level until end of turn.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "champion",
              player: "controller",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "level",
              operation: "add",
              amount: 1,
            },
          },
        },
        {
          id: "y8fx8G64C9-a2",
          kind: "activated",
          text: "REST: Target Animal or Beast ally gets your choice of +1 POWER or +1 LIFE until end of turn.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
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
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            modes: [
              {
                id: "choice-1",
                text: "+1 POWER",
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-turn",
                  },
                  layer: {
                    layer: "E",
                    modifies: "stat",
                    sublayer: "modifier",
                  },
                  change: {
                    kind: "numeric",
                    property: "power",
                    operation: "add",
                    amount: 1,
                  },
                },
              },
              {
                id: "choice-2",
                text: "+1 LIFE",
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-turn",
                  },
                  layer: {
                    layer: "E",
                    modifies: "stat",
                    sublayer: "modifier",
                  },
                  change: {
                    kind: "numeric",
                    property: "life",
                    operation: "add",
                    amount: 1,
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

export default fluteOfTaming;
