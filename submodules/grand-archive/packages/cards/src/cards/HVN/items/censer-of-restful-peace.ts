import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const censerOfRestfulPeace: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0nlhgqpckq",
  slug: "censer-of-restful-peace",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0nlhgqpckq:face:default",
      catalogId: "0nlhgqpckq",
      name: "Censer of Restful Peace",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText: "Cards in graveyards lose all abilities.",
      abilities: [
        {
          id: "0nlhgqpckq-a1",
          kind: "static",
          staticKind: "effects",
          text: "Cards in graveyards lose all abilities.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["graveyard"],
                  player: "each-player",
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "remove-abilities",
              },
            },
          ],
        },
      ],
    },
  },
};

export default censerOfRestfulPeace;
