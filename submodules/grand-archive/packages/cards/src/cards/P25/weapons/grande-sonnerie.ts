import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const grandeSonnerie: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "s4b2mkh1xm",
  slug: "grande-sonnerie",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "s4b2mkh1xm:face:default",
      catalogId: "s4b2mkh1xm",
      name: "Grande Sonnerie",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 2,
        durability: 3,
      },
      rulesText:
        "[Ciel Bonus] As long as the total reserve cost of your omens is 10 or greater, Grande Sonnerie gets +2POWER.",
      abilities: [
        {
          id: "s4b2mkh1xm-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Ciel Bonus] As long as the total reserve cost of your omens is 10 or greater, Grande Sonnerie gets +2POWER.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
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
                kind: "compare",
                comparison: {
                  left: {
                    kind: "aggregate-property",
                    operation: "sum",
                    collection: {
                      zones: ["banishment"],
                      player: "controller",
                      filter: {
                        kind: "has-counter",
                        counter: "omen",
                      },
                    },
                    property: "reserve-cost",
                    basis: "current",
                    emptyValue: 0,
                  },
                  operator: "gte",
                  right: 10,
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

export default grandeSonnerie;
