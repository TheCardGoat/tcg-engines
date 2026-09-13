import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ghastlySlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "XFWU8KTVW9",
  slug: "ghastly-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "XFWU8KTVW9:face:default",
      catalogId: "XFWU8KTVW9",
      name: "Ghastly Slime",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SPECTER", "ANIMAL", "SLIME"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "As long as Ghastly Slime is ephemeral, it gets +2 POWER. \n\n[Class Bonus] Ephemerate — (2) (You may activate this card from your graveyard by paying this cost. Ally cards played this way become ephemeral as they enter the field.)",
      abilities: [
        {
          id: "XFWU8KTVW9-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as Ghastly Slime is ephemeral, it gets +2 POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "ephemeral",
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
        {
          id: "XFWU8KTVW9-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Ephemerate — (2) (You may activate this card from your graveyard by paying this cost. Ally cards played this way become ephemeral as they enter the field.)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "pay-reserve",
              amount: 2,
            },
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

export default ghastlySlime;
