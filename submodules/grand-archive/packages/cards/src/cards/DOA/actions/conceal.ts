import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const conceal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8nbmykyXcw",
  slug: "conceal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8nbmykyXcw:face:default",
      catalogId: "8nbmykyXcw",
      name: "Conceal",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Allies you control gain stealth until end of turn. (Units with stealth can't be targeted by attacks unless permitted by true sight.)",
      abilities: [
        {
          id: "8nbmykyXcw-a1",
          kind: "card-resolution",
          text: "Allies you control gain stealth until end of turn. (Units with stealth can't be targeted by attacks unless permitted by true sight.)",
          effect: {
            kind: "continuous",
            subjects: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "stealth",
              },
            },
          },
        },
      ],
    },
  },
};

export default conceal;
