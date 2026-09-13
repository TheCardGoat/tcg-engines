import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const conflagrativeTrounce: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vke9gsgfdm",
  slug: "conflagrative-trounce",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vke9gsgfdm:face:default",
      catalogId: "vke9gsgfdm",
      name: "Conflagrative Trounce",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
      },
      rulesText:
        "[Ciel Bonus] As long as you have two or more omens with the same reserve cost, Conflagrative Trounce gets +2POWER.",
      abilities: [
        {
          id: "vke9gsgfdm-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Ciel Bonus] As long as you have two or more omens with the same reserve cost, Conflagrative Trounce gets +2POWER.",
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
                kind: "collection-has-shared-characteristic",
                collection: {
                  zones: ["banishment"],
                  player: "controller",
                  filter: {
                    kind: "has-counter",
                    counter: "omen",
                  },
                },
                characteristic: "reserve-cost",
                minimumMatching: 2,
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

export default conflagrativeTrounce;
