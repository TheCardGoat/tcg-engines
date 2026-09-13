import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const siegeMauler: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bsuO8TVe7p",
  slug: "siege-mauler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bsuO8TVe7p:face:default",
      catalogId: "bsuO8TVe7p",
      name: "Siege Mauler",
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
        power: 2,
        life: 3,
      },
      rulesText: "As long as Siege Mauler is attacking a domain, it gets +2 POWER.",
      abilities: [
        {
          id: "bsuO8TVe7p-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as Siege Mauler is attacking a domain, it gets +2 POWER.",
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
                amount: 2,
              },
            },
          ],
        },
      ],
    },
  },
};

export default siegeMauler;
