import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const angelicVanguard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "aKjX6INGkV",
  slug: "angelic-vanguard",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "aKjX6INGkV:face:default",
      catalogId: "aKjX6INGkV",
      name: "Angelic Vanguard",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "ANGEL"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "Advanced Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are advanced element, this card becomes imbued.)\n\nAs long as Angelic Vanguard is imbued, it has intercept and retort 2.",
      abilities: [
        {
          id: "aKjX6INGkV-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Advanced Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are advanced element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 2,
            elementRequirement: "advanced",
          },
        },
        {
          id: "aKjX6INGkV-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as Angelic Vanguard is imbued, it has intercept and retort 2.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "activation-state",
                state: "imbued",
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
                  name: "intercept",
                },
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "activation-state",
                state: "imbued",
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
                  name: "retort",
                  value: 2,
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default angelicVanguard;
