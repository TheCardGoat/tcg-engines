import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hornedKnight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vjdbqgku4z",
  slug: "horned-knight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vjdbqgku4z:face:default",
      catalogId: "vjdbqgku4z",
      name: "Horned Knight",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "ANIMAL", "HUMAN", "UNICORN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText: "As long as Horned Knight is attacking an ally, Horned Knight gets +1POWER.",
      abilities: [
        {
          id: "vjdbqgku4z-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as Horned Knight is attacking an ally, Horned Knight gets +1POWER.",
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
                  oneOf: ["ALLY"],
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

export default hornedKnight;
