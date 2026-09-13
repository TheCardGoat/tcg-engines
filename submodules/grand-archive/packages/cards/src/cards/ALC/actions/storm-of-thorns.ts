import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stormOfThorns: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "39i1f0ht2t",
  slug: "storm-of-thorns",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "39i1f0ht2t:face:default",
      catalogId: "39i1f0ht2t",
      name: "Storm of Thorns",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "If damage would be dealt to a unit you control this turn, prevent 1 of that damage. If the damage prevented had a unit as its source, deal 1 damage to that unit. \n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "39i1f0ht2t-a1",
          kind: "card-resolution",
          text: "If damage would be dealt to a unit you control this turn, prevent 1 of that damage. If the damage prevented had a unit as its source, deal 1 damage to that unit.",
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
            operation: {
              kind: "prevent",
              amount: 1,
            },
            duration: {
              kind: "this-turn",
            },
            afterApply: {
              kind: "conditional",
              condition: {
                kind: "subject-matches",
                subject: {
                  kind: "event-source",
                },
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
              then: {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "event-source",
                },
                amount: 1,
              },
            },
          },
        },
        {
          id: "39i1f0ht2t-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
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

export default stormOfThorns;
