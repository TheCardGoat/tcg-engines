import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vacuousServant: GrandArchiveCard<
  GrandArchiveAbilityDefinition,
  "token-representation"
> = {
  canonicalId: "L67r0GlRHR",
  slug: "vacuous-servant",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "L67r0GlRHR:face:default",
      catalogId: "L67r0GlRHR",
      name: "Vacuous Servant",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "[Ciel Bonus] Vacuous Servant gets +1 POWER for each attack omen you have and +1 LIFE for each ally omen you have.",
      abilities: [
        {
          id: "L67r0GlRHR-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Ciel Bonus] Vacuous Servant gets +1 POWER for each attack omen you have and +1 LIFE for each ally omen you have.",
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
                amount: {
                  kind: "count",
                  collection: {
                    zones: ["banishment"],
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "has-counter",
                          counter: "omen",
                        },
                        {
                          kind: "type",
                          oneOf: ["ATTACK"],
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default vacuousServant;
