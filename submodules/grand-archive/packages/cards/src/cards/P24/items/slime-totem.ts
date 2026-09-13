import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const slimeTotem: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jwanjcy453",
  slug: "slime-totem",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jwanjcy453:face:default",
      catalogId: "jwanjcy453",
      name: "Slime Totem",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ARTIFACT"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "Slime allies you control have vigor. (These units wake up at the beginning of your end phase.)",
      abilities: [
        {
          id: "jwanjcy453-a1",
          kind: "static",
          staticKind: "effects",
          text: "Slime allies you control have vigor. (These units wake up at the beginning of your end phase.)",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
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
                        oneOf: ["SLIME"],
                      },
                    ],
                  },
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
                kind: "grant-keyword",
                keyword: {
                  name: "vigor",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default slimeTotem;
