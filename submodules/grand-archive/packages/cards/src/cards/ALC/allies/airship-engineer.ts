import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const airshipEngineer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "66pv4n1n3g",
  slug: "airship-engineer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "66pv4n1n3g:face:default",
      catalogId: "66pv4n1n3g",
      name: "Airship Engineer",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Ranged 2 (As long as this unit is distant, its attacks get +2 POWER. Apply this effect only if your champion's class matches this card's class.)\n\nOn Enter: If you control a distant unit, draw a card into your memory.",
      abilities: [
        {
          id: "66pv4n1n3g-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Ranged 2 (As long as this unit is distant, its attacks get +2 POWER. Apply this effect only if your champion's class matches this card's class.)",
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
        {
          id: "66pv4n1n3g-a2",
          kind: "triggered",
          text: "On Enter: If you control a distant unit, draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "collection-exists",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "object-state",
                      state: "distant",
                    },
                  ],
                },
              },
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
              to: "memory",
            },
          },
        },
      ],
    },
  },
};

export default airshipEngineer;
