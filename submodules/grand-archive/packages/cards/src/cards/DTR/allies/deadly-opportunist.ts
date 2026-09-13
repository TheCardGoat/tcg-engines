import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const deadlyOpportunist: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "eyvxonorcs",
  slug: "deadly-opportunist",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "eyvxonorcs:face:default",
      catalogId: "eyvxonorcs",
      name: "Deadly Opportunist",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Deadly Opportunist gets +3POWER as long as it's attacking a rested ally.\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "eyvxonorcs-a1",
          kind: "static",
          staticKind: "effects",
          text: "Deadly Opportunist gets +3POWER as long as it's attacking a rested ally.",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "object-state",
                      state: "rested",
                    },
                  ],
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
        {
          id: "eyvxonorcs-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
      ],
    },
  },
};

export default deadlyOpportunist;
