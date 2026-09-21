import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const scorchingKnowledge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ECx3KFWqFD",
  slug: "scorching-knowledge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ECx3KFWqFD:face:default",
      catalogId: "ECx3KFWqFD",
      name: "Scorching Knowledge",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Empower 3. (The next Spell card you activate this turn activates and resolves as if your champion got +3 level.)\n\n[Rai Bonus] You may remove an enlighten counter from your champion. If you do, empower 3.",
      abilities: [
        {
          id: "ECx3KFWqFD-a1",
          kind: "card-resolution",
          text: "Empower 3. (The next Spell card you activate this turn activates and resolves as if your champion got +3 level.)",
          effect: {
            kind: "keyword-action",
            action: "empower",
            amount: 3,
          },
        },
        {
          id: "ECx3KFWqFD-a2",
          kind: "card-resolution",
          text: "[Rai Bonus] You may remove an enlighten counter from your champion. If you do, empower 3.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Rai",
              },
            },
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "remove-counter",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "enlighten",
                    amount: 1,
                    bindResultAs: "removed-counters",
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "keyword-action",
                    action: "empower",
                    amount: 3,
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default scorchingKnowledge;
