import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hulkingRearguard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "JzWfOQUzG5",
  slug: "hulking-rearguard",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "JzWfOQUzG5:face:default",
      catalogId: "JzWfOQUzG5",
      name: "Hulking Rearguard",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 3,
        life: 4,
      },
      rulesText:
        "[Class Bonus] As long as you control a unit with taunt, this card costs 2 less to activate. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "JzWfOQUzG5-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as you control a unit with taunt, this card costs 2 less to activate. (Apply this effect only if your champion's class matches this card's class.)",
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
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY", "CHAMPION"],
                  },
                },
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
      ],
    },
  },
};

export default hulkingRearguard;
