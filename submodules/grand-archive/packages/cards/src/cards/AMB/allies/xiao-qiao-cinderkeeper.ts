import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const xiaoQiaoCinderkeeper: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3hgldrogit",
  slug: "xiao-qiao-cinderkeeper",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3hgldrogit:face:default",
      catalogId: "3hgldrogit",
      name: "Xiao Qiao, Cinderkeeper",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["ASSASSIN", "TAMER"],
        subtypes: ["ASSASSIN", "TAMER", "ANIMAL", "HUMAN", "CAT"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Stealth (This unit can't be targeted by attacks unless permitted by true sight.)\n\n[Class Bonus] Xiao Qiao's attacks can't be retaliated.\n\nIf a unit hit by Xiao Qiao this turn would die, banish it instead.",
      abilities: [
        {
          id: "3hgldrogit-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Stealth (This unit can't be targeted by attacks unless permitted by true sight.)",
          keyword: {
            name: "stealth",
          },
        },
        {
          id: "3hgldrogit-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Xiao Qiao's attacks can't be retaliated.",
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
              mode: "forbid",
              action: "retaliate",
              subject: {
                kind: "attacks-by",
                attacker: {
                  kind: "source",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "3hgldrogit-a3",
          kind: "static",
          staticKind: "effects",
          text: "If a unit hit by Xiao Qiao this turn would die, banish it instead.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-died",
                subject: {
                  kind: "event-object",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY", "CHAMPION"],
                  },
                },
              },
              condition: {
                kind: "history",
                event: "attack-hit",
                window: "this-turn",
                source: {
                  kind: "source",
                },
                subject: {
                  kind: "event-subject",
                },
              },
              operation: {
                kind: "replace-with",
                effect: {
                  kind: "banish-object",
                  subject: {
                    kind: "event-subject",
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

export default xiaoQiaoCinderkeeper;
