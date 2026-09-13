import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gloriousPresence: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5s2aumgjzn",
  slug: "glorious-presence",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5s2aumgjzn:face:default",
      catalogId: "5s2aumgjzn",
      name: "Glorious Presence",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["PHANTASIA"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SPELL"],
      },
      elements: ["LUXEM"],
      stats: {},
      rulesText:
        "As long as you control a Shenju ally, advanced element cards your opponents activate cost 2 more to activate.",
      abilities: [
        {
          id: "5s2aumgjzn-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you control a Shenju ally, advanced element cards your opponents activate cost 2 more to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "player",
                player: "opponent",
              },
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                  {
                    kind: "element-category",
                    value: "advanced",
                  },
                  {
                    kind: "subtype",
                    oneOf: ["SHENJU"],
                  },
                ],
              },
              costKind: "reserve",
              costOperation: "add",
              amount: 2,
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

export default gloriousPresence;
