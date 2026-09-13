import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const academyGuide: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "kk39i1f0ht",
  slug: "academy-guide",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "kk39i1f0ht:face:default",
      catalogId: "kk39i1f0ht",
      name: "Academy Guide",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ANIMAL", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText: "Champion cards you materialize cost 1 less to materialize.",
      abilities: [
        {
          id: "kk39i1f0ht-a1",
          kind: "static",
          staticKind: "effects",
          text: "Champion cards you materialize cost 1 less to materialize.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "materialize",
              filter: {
                kind: "type",
                oneOf: ["CHAMPION"],
              },
              costKind: "memory",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default academyGuide;
