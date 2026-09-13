import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sableRemnant: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8n4zw4gq5w",
  slug: "sable-remnant",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8n4zw4gq5w:face:default",
      catalogId: "8n4zw4gq5w",
      name: "Sable Remnant",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "AUTOMATON"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "[Class Bonus] Sable Remnant gets +1 POWER.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "8n4zw4gq5w-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Sable Remnant gets +1 POWER.",
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
                amount: 1,
              },
            },
          ],
        },
        {
          id: "8n4zw4gq5w-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default sableRemnant;
