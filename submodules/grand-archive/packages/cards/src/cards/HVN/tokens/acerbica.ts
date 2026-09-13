import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const acerbica: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> = {
  canonicalId: "7ax4ywyv19",
  slug: "acerbica",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "7ax4ywyv19:face:default",
      catalogId: "7ax4ywyv19",
      name: "Acerbica",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FLOWER"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText: "Champions you control get -1 level.",
      abilities: [
        {
          id: "7ax4ywyv19-a1",
          kind: "static",
          staticKind: "effects",
          text: "Champions you control get -1 level.",
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
                    oneOf: ["CHAMPION"],
                  },
                },
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
                property: "level",
                operation: "subtract",
                amount: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

export default acerbica;
