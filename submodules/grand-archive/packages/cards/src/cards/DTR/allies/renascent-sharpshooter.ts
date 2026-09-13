import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const renascentSharpshooter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gbnvtkm7rf",
  slug: "renascent-sharpshooter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gbnvtkm7rf:face:default",
      catalogId: "gbnvtkm7rf",
      name: "Renascent Sharpshooter",
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
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Ranged 1 (As long as this unit is distant, its attacks get +1POWER.) \n\n[Class Bonus] Whenever Renascent Sharpshooter becomes distant, draw a card into your memory.",
      abilities: [
        {
          id: "gbnvtkm7rf-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 1 (As long as this unit is distant, its attacks get +1POWER.)",
          keyword: {
            name: "ranged",
            value: 1,
          },
        },
        {
          id: "gbnvtkm7rf-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever Renascent Sharpshooter becomes distant, draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-state-changed",
              subject: {
                kind: "source",
              },
              state: "distant",
              to: true,
            },
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
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default renascentSharpshooter;
