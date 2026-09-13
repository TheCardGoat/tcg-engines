import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const findTheLost: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jTBNAEedbg",
  slug: "find-the-lost",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jTBNAEedbg:face:default",
      catalogId: "jTBNAEedbg",
      name: "Find the Lost",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 3,
      },
      rulesText: "Prepare 1\n\nAs long as Find the Lost was prepared, it has unblockable.",
      abilities: [
        {
          id: "jTBNAEedbg-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Prepare 1",
          keyword: {
            name: "prepare",
            value: 1,
          },
        },
        {
          id: "jTBNAEedbg-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as Find the Lost was prepared, it has unblockable.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "activation-state",
                state: "prepared",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "unblockable",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default findTheLost;
