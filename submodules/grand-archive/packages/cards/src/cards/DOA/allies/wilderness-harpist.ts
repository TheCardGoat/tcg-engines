import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const wildernessHarpist: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "aKgdkLSBza",
  slug: "wilderness-harpist",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "aKgdkLSBza:face:default",
      catalogId: "aKgdkLSBza",
      name: "Wilderness Harpist",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Stealth (This unit can't be targeted by attacks unless permitted by true sight.)\n\nWhenever you activate a Harmony or Melody card, your champion gets +1 level until end of turn.",
      abilities: [
        {
          id: "aKgdkLSBza-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Stealth (This unit can't be targeted by attacks unless permitted by true sight.)",
          keyword: {
            name: "stealth",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
        {
          id: "aKgdkLSBza-a2",
          kind: "triggered",
          text: "Whenever you activate a Harmony or Melody card, your champion gets +1 level until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["HARMONY", "MELODY"],
                },
              },
            },
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "champion",
              player: "controller",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "level",
              operation: "add",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default wildernessHarpist;
