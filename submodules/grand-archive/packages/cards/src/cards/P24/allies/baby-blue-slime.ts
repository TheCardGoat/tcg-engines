import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const babyBlueSlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9ggfiy38t2",
  slug: "baby-blue-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9ggfiy38t2:face:default",
      catalogId: "9ggfiy38t2",
      name: "Baby Blue Slime",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "SLIME"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Baby Blue Slime gets +1 LIFE. (Apply this effect only if your champion's class matches this card's class.)\n\nREST: Prevent the next 2 damage that would be dealt to another target Slime ally you control this turn.",
      abilities: [
        {
          id: "9ggfiy38t2-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Baby Blue Slime gets +1 LIFE. (Apply this effect only if your champion's class matches this card's class.)",
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
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "life",
                operation: "add",
                amount: 1,
              },
            },
          ],
        },
        {
          id: "9ggfiy38t2-a2",
          kind: "activated",
          text: "REST: Prevent the next 2 damage that would be dealt to another target Slime ally you control this turn.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "not-source",
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "bound-object",
                binding: "target-1",
              },
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: 2,
              scope: "replacement-instance",
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

export default babyBlueSlime;
