import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const maidenOfGlimmersDusk: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qa4ke7txh0",
  slug: "maiden-of-glimmers-dusk",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qa4ke7txh0:face:default",
      catalogId: "qa4ke7txh0",
      name: "Maiden of Glimmer's Dusk",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA", "ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "APPARITION"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] This card costs 1 less to activate for each of up to two phantasias you control. (Apply this effect only if your champion's class matches this card's class.)\n",
      abilities: [
        {
          id: "qa4ke7txh0-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate for each of up to two phantasias you control. (Apply this effect only if your champion's class matches this card's class.)",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["PHANTASIA"],
                  },
                },
              },
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

export default maidenOfGlimmersDusk;
