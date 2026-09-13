import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const nanyuePortsman: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "v5ppxyu1jm",
  slug: "nanyue-portsman",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "v5ppxyu1jm:face:default",
      catalogId: "v5ppxyu1jm",
      name: "Nanyue Portsman",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN", "WARRIOR"],
        subtypes: ["GUARDIAN", "WARRIOR", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Equestrian — As long as you control a Horse ally, Nanyue Portsman gets +1 POWER.\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "v5ppxyu1jm-a1",
          kind: "static",
          staticKind: "effects",
          text: "Equestrian — As long as you control a Horse ally, Nanyue Portsman gets +1 POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["HORSE"],
                      },
                    ],
                  },
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
          label: {
            name: "Equestrian",
          },
        },
        {
          id: "v5ppxyu1jm-a2",
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

export default nanyuePortsman;
