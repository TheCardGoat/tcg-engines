import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ripplesOfAtrophy: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "u0yaub9dal",
  slug: "ripples-of-atrophy",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "u0yaub9dal:face:default",
      catalogId: "u0yaub9dal",
      name: "Ripples of Atrophy",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["TERA"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] Efficiency (This card costs LV less to activate. LV refers to your champion's level.)\n\nChoose any amount of non-champion objects and put two wither counters on each of them. ",
      abilities: [
        {
          id: "u0yaub9dal-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Efficiency (This card costs LV less to activate. LV refers to your champion's level.)",
          keyword: {
            name: "efficiency",
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
          id: "u0yaub9dal-a2",
          kind: "card-resolution",
          text: "Choose any amount of non-champion objects and put two wither counters on each of them.",
          effect: {
            kind: "choose",
            selection: {
              id: "chosen-objects",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "any-number",
              },
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "each-player",
                filter: {
                  kind: "not",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
            },
            effect: {
              kind: "add-counter",
              subject: {
                kind: "bound",
                binding: "chosen-objects",
              },
              counter: "wither",
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default ripplesOfAtrophy;
