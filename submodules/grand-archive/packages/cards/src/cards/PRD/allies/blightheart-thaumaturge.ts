import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blightheartThaumaturge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2zCWq2DUDt",
  slug: "blightheart-thaumaturge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2zCWq2DUDt:face:default",
      catalogId: "2zCWq2DUDt",
      name: "Blightheart Thaumaturge",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "On Enter: If you control an Elysian object, Blightheart Thaumaturge gets +2POWER until end of turn.",
      abilities: [
        {
          id: "2zCWq2DUDt-a1",
          kind: "triggered",
          text: "On Enter: If you control an Elysian object, Blightheart Thaumaturge gets +2POWER until end of turn.",
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
                  kind: "subtype",
                  oneOf: ["ELYSIAN"],
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
        },
      ],
    },
  },
};

export default blightheartThaumaturge;
