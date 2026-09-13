import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bifurcatingFractal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "MiIBTi1hju",
  slug: "bifurcating-fractal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "MiIBTi1hju:face:default",
      catalogId: "MiIBTi1hju",
      name: "Bifurcating Fractal",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "FRACTAL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Reservable\n\n[Class Bonus] (3), REST, Sacrifice Bifurcating Fractal: Summon two Core Fractal tokens rested. (Activate this ability only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "MiIBTi1hju-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Reservable",
          keyword: {
            name: "reservable",
          },
        },
        {
          id: "MiIBTi1hju-a2",
          kind: "activated",
          text: "[Class Bonus] (3), REST, Sacrifice Bifurcating Fractal: Summon two Core Fractal tokens rested. (Activate this ability only if your champion's class matches this card's class.)",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
            ],
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
          effect: {
            kind: "summon",
            object: "Core Fractal",
            controller: "controller",
            bindResultAs: "summoned-token",
            amount: 2,
            entersWithStates: ["rested"],
          },
        },
      ],
    },
  },
};

export default bifurcatingFractal;
