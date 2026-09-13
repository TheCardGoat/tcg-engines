import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const nullifyingLantern: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "urKxcUjz9a",
  slug: "nullifying-lantern",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "urKxcUjz9a:face:default",
      catalogId: "urKxcUjz9a",
      name: "Nullifying Lantern",
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
      rulesText: "Cards in graveyards are norm element. (They are not any other element.)",
      abilities: [
        {
          id: "urKxcUjz9a-a1",
          kind: "static",
          staticKind: "effects",
          text: "Cards in graveyards are norm element. (They are not any other element.)",
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
                layer: "C",
                modifies: "element",
              },
              change: {
                kind: "set-elements",
                elements: ["NORM"],
              },
            },
          ],
        },
      ],
    },
  },
};

export default nullifyingLantern;
