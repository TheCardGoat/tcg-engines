import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const epochalConqueror: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gR3LGjzKPS",
  slug: "epochal-conqueror",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gR3LGjzKPS:face:default",
      catalogId: "gR3LGjzKPS",
      name: "Epochal Conqueror",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText: "As long as Epochal Conqueror is attacking a domain, it gets +3POWER.",
      abilities: [
        {
          id: "gR3LGjzKPS-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as Epochal Conqueror is attacking a domain, it gets +3POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "combat-relation",
                relation: "attacking",
                subject: {
                  kind: "source",
                },
                otherFilter: {
                  kind: "type",
                  oneOf: ["DOMAIN"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
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
                amount: 3,
              },
            },
          ],
        },
      ],
    },
  },
};

export default epochalConqueror;
