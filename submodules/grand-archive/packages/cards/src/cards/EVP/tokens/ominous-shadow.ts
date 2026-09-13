import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ominousShadow: GrandArchiveCard<
  GrandArchiveAbilityDefinition,
  "token-representation"
> = {
  canonicalId: "gveirpdm44",
  slug: "ominous-shadow",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "gveirpdm44:face:default",
      catalogId: "gveirpdm44",
      name: "Ominous Shadow",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA", "ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SHADOW"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "Unblockable (This unit’s attacks can’t be intercepted and ignores taunt.)\n\nIf damage would be dealt to Ominous Shadow, prevent 3 of that damage.\n\nOminous Shadow may only declare attacks against units your champion has dealt combat damage to this turn.",
      abilities: [
        {
          id: "gveirpdm44-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Unblockable (This unit’s attacks can’t be intercepted and ignores taunt.)",
          keyword: {
            name: "unblockable",
          },
        },
        {
          id: "gveirpdm44-a2",
          kind: "static",
          staticKind: "effects",
          text: "If damage would be dealt to Ominous Shadow, prevent 3 of that damage.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "source",
                },
              },
              operation: {
                kind: "prevent",
                amount: 3,
              },
              duration: {
                kind: "while-source-on-field",
              },
            },
          ],
        },
        {
          id: "gveirpdm44-a3",
          kind: "static",
          staticKind: "effects",
          text: "Ominous Shadow may only declare attacks against units your champion has dealt combat damage to this turn.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "attack",
              subject: {
                kind: "source",
              },
              against: {
                kind: "candidate",
              },
              condition: {
                kind: "not",
                condition: {
                  kind: "history",
                  event: "damage-dealt",
                  window: "this-turn",
                  source: {
                    kind: "champion",
                    player: "controller",
                  },
                  recipient: {
                    kind: "candidate",
                  },
                  combatDamage: true,
                  minimum: 1,
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

export default ominousShadow;
