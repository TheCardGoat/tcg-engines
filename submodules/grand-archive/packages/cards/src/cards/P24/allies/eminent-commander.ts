import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const eminentCommander: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "iow4occyxi",
  slug: "eminent-commander",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "iow4occyxi:face:default",
      catalogId: "iow4occyxi",
      name: "Eminent Commander",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] This card costs 3 less to activate as long as your champion has dealt 3 or more combat damage this turn. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "iow4occyxi-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 3 less to activate as long as your champion has dealt 3 or more combat damage this turn. (Apply this effect only if your champion's class matches this card's class.)",
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
                event: "damage-dealt",
                window: "this-turn",
                actor: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
                combatDamage: true,
                eventAmountMinimum: 3,
                minimum: 1,
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 3,
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

export default eminentCommander;
