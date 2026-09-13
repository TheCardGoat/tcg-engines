import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const crosswindCuts: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "S0YCKJcU5e",
  slug: "crosswind-cuts",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "S0YCKJcU5e:face:default",
      catalogId: "S0YCKJcU5e",
      name: "Crosswind Cuts",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
      },
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\n\nMultistrike 1 (You may assign up to one additional target as you declare this attack.)",
      abilities: [
        {
          id: "S0YCKJcU5e-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate.",
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
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "S0YCKJcU5e-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Multistrike 1 (You may assign up to one additional target as you declare this attack.)",
          keyword: {
            name: "multistrike",
            value: 1,
          },
        },
      ],
    },
  },
};

export default crosswindCuts;
