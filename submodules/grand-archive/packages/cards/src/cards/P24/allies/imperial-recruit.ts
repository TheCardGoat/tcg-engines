import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const imperialRecruit: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lzsmw3rrii",
  slug: "imperial-recruit",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lzsmw3rrii:face:default",
      catalogId: "lzsmw3rrii",
      name: "Imperial Recruit",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Foster (At the beginning of your recollection phase, if this ally hasn’t been dealt damage since the end of your previous turn, it becomes fostered.) \n\nImperial Recruit gets +1 POWER as long as it's fostered.",
      abilities: [
        {
          id: "lzsmw3rrii-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Foster (At the beginning of your recollection phase, if this ally hasn’t been dealt damage since the end of your previous turn, it becomes fostered.)",
          keyword: {
            name: "foster",
          },
        },
        {
          id: "lzsmw3rrii-a2",
          kind: "static",
          staticKind: "effects",
          text: "Imperial Recruit gets +1 POWER as long as it's fostered.",
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
                state: "fostered",
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
        },
      ],
    },
  },
};

export default imperialRecruit;
