import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const baidiOathswornPalace: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "43rtqovkti",
  slug: "baidi-oathsworn-palace",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "43rtqovkti:face:default",
      catalogId: "43rtqovkti",
      name: "Baidi, Oathsworn Palace",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SIEGEABLE", "CASTLE"],
      },
      elements: ["WIND"],
      stats: {
        durability: 6,
      },
      rulesText:
        "(Siegeable — This domain can be attacked. It takes damage in the form of removing durability counters.)\n\nRanger units you control have ranged 1.",
      abilities: [
        {
          id: "43rtqovkti-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Siegeable — This domain can be attacked. It takes damage in the form of removing durability counters.)",
          keyword: {
            name: "siegeable",
          },
        },
        {
          id: "43rtqovkti-a2",
          kind: "static",
          staticKind: "effects",
          text: "Ranger units you control have ranged 1.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY", "CHAMPION"],
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
                  name: "ranged",
                  value: 1,
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default baidiOathswornPalace;
