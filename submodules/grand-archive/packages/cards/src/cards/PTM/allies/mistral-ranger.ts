import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mistralRanger: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lClyP34mj6",
  slug: "mistral-ranger",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lClyP34mj6:face:default",
      catalogId: "lClyP34mj6",
      name: "Mistral Ranger",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] As long as you've activated an Aethercharge card this turn, this card costs 1 less to activate.\n\n[Class Bonus] Ranged 2 (As long as this unit is distant, its attacks get +2 POWER. Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "lClyP34mj6-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as you've activated an Aethercharge card this turn, this card costs 1 less to activate.",
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
              condition: {
                kind: "history",
                event: "card-activated",
                window: "this-turn",
                actor: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["AETHERCHARGE"],
                },
                minimum: 1,
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "lClyP34mj6-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Ranged 2 (As long as this unit is distant, its attacks get +2 POWER. Apply this effect only if your champion’s class matches this card’s class.)",
          keyword: {
            name: "ranged",
            value: 2,
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
      ],
    },
  },
};

export default mistralRanger;
