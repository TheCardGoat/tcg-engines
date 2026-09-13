import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const voldaSmoldersSpite: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ecZsQQAYJJ",
  slug: "volda-smolders-spite",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ecZsQQAYJJ:face:default",
      catalogId: "ecZsQQAYJJ",
      name: "Volda, Smolder's Spite",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC", "GUARDIAN"],
        subtypes: ["CLERIC", "GUARDIAN", "AUTOMATON"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Level 2+] Fast Activation (You may activate this card at fast speed.)\n\n[Class Bonus] On Enter: Until end of turn, damage dealt by fire element sources you control can't be prevented.",
      abilities: [
        {
          id: "ecZsQQAYJJ-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Level 2+] Fast Activation (You may activate this card at fast speed.)",
          keyword: {
            name: "fast-activation",
          },
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
        },
        {
          id: "ecZsQQAYJJ-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Until end of turn, damage dealt by fire element sources you control can't be prevented.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
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
            kind: "rule-modification",
            mode: "forbid",
            action: "prevent-damage",
            subject: {
              kind: "player",
              player: "each-player",
            },
            sourceFilter: {
              kind: "element",
              oneOf: ["FIRE"],
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default voldaSmoldersSpite;
