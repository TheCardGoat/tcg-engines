import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const jinUndyingResolve: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "c4yrrtv7o1",
  slug: "jin-undying-resolve",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "c4yrrtv7o1:face:default",
      catalogId: "c4yrrtv7o1",
      name: "Jin, Undying Resolve",
      lineageName: "Jin",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["EXIA"],
      stats: {
        level: 3,
        life: 28,
      },
      rulesText:
        "Jin Lineage \n\nAs long as it's not your end phase, Jin has immortality. (A unit with immortality can't die.)",
      abilities: [
        {
          id: "c4yrrtv7o1-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Jin Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Jin",
          },
        },
        {
          id: "c4yrrtv7o1-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as it's not your end phase, Jin has immortality. (A unit with immortality can't die.)",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "not",
                condition: {
                  kind: "phase",
                  phase: "end",
                },
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
                  name: "immortality",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default jinUndyingResolve;
