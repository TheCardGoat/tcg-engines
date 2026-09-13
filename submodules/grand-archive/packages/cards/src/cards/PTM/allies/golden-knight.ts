import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const goldenKnight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dJlNMQ5rWP",
  slug: "golden-knight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dJlNMQ5rWP:face:default",
      catalogId: "dJlNMQ5rWP",
      name: "Golden Knight",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "CHESSMAN", "KNIGHT", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Alice Bonus] As long as Golden Knight is attacking a unit with intercept or taunt, Golden Knight gets +1 POWER.",
      abilities: [
        {
          id: "dJlNMQ5rWP-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Alice Bonus] As long as Golden Knight is attacking a unit with intercept or taunt, Golden Knight gets +1 POWER.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
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
                  oneOf: ["ALLY", "CHAMPION"],
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
                amount: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

export default goldenKnight;
