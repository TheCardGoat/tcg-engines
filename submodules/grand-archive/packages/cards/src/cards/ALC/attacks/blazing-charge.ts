import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blazingCharge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "s5jwsl7ded",
  slug: "blazing-charge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "s5jwsl7ded:face:default",
      catalogId: "s5jwsl7ded",
      name: "Blazing Charge",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["FIRE"],
      stats: {
        power: 3,
      },
      rulesText:
        "[Class Bonus] Blazing Charge gets +2 POWER.\n\nOn Attack: Until the beginning of your next turn, if damage would be dealt to your champion, they take that much damage plus 1 instead.",
      abilities: [
        {
          id: "s5jwsl7ded-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Blazing Charge gets +2 POWER.",
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
                property: "power",
                operation: "add",
                amount: 2,
              },
            },
          ],
        },
        {
          id: "s5jwsl7ded-a2",
          kind: "triggered",
          text: "On Attack: Until the beginning of your next turn, if damage would be dealt to your champion, they take that much damage plus 1 instead.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
            operation: {
              kind: "modify-amount",
              operation: "add",
              amount: 1,
            },
            duration: {
              kind: "until-start-of-turn",
              whose: "controller",
            },
          },
        },
      ],
    },
  },
};

export default blazingCharge;
