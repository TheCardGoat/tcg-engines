import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const volatileFusilier: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "m3n9yvn1uo",
  slug: "volatile-fusilier",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "m3n9yvn1uo:face:default",
      catalogId: "m3n9yvn1uo",
      name: "Volatile Fusilier",
      cost: {
        kind: "reserve",
        amount: 1,
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
        life: 1,
      },
      rulesText:
        "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.) \n\n[Class Bonus] On Enter: You may have Volatile Fusilier deal 4 damage to your champion. If you do, Volatile Fusilier becomes distant.",
      abilities: [
        {
          id: "m3n9yvn1uo-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "m3n9yvn1uo-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: You may have Volatile Fusilier deal 4 damage to your champion. If you do, Volatile Fusilier becomes distant.",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "champion",
                    player: "controller",
                  },
                  amount: 4,
                },
                {
                  kind: "set-object-state",
                  subject: {
                    kind: "source",
                  },
                  state: "distant",
                  value: true,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default volatileFusilier;
