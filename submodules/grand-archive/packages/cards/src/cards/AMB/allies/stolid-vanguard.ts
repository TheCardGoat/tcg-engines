import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stolidVanguard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yrm3xibmoz",
  slug: "stolid-vanguard",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yrm3xibmoz:face:default",
      catalogId: "yrm3xibmoz",
      name: "Stolid Vanguard",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Equestrian — On Enter: If you control a Horse ally, Stolid Vanguard gets +2 POWER until end of turn.",
      abilities: [
        {
          id: "yrm3xibmoz-a1",
          kind: "triggered",
          text: "Equestrian — On Enter: If you control a Horse ally, Stolid Vanguard gets +2 POWER until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "collection-exists",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["HORSE"],
                    },
                  ],
                },
              },
            },
            then: {
              kind: "continuous",
              subjects: {
                kind: "source",
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
                amount: 2,
              },
            },
          },
          label: {
            name: "Equestrian",
          },
        },
      ],
    },
  },
};

export default stolidVanguard;
