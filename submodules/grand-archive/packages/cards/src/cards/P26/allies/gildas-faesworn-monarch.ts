import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gildasFaeswornMonarch: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "g99PIuhU0O",
  slug: "gildas-faesworn-monarch",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "g99PIuhU0O:face:default",
      catalogId: "g99PIuhU0O",
      name: "Gildas, Faesworn Monarch",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FAIRY"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {
        power: 4,
        life: 3,
      },
      rulesText:
        "Stealth, Vigor\n\n[Mordred Bonus] (2),  REST: Prevent the next 4 damage that would be dealt to target unit this turn. As long as you control another Fairy ally, this ability costs (2) less to activate. (Activate this ability only if your champion is Mordred.)",
      abilities: [
        {
          id: "g99PIuhU0O-a1",
          kind: "keyword-group",
          text: "Stealth, Vigor",
          keywords: [
            {
              name: "stealth",
            },
            {
              name: "vigor",
            },
          ],
        },
        {
          id: "g99PIuhU0O-a2",
          kind: "activated",
          text: "[Mordred Bonus] (2),  REST: Prevent the next 4 damage that would be dealt to target unit this turn. As long as you control another Fairy ally, this ability costs (2) less to activate. (Activate this ability only if your champion is Mordred.)",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          targets: [
            {
              id: "target-unit",
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
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          costModifiers: [
            {
              operation: "subtract",
              amount: 2,
              condition: {
                kind: "controls",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["FAIRY"],
                    },
                    {
                      kind: "not-source",
                    },
                  ],
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Mordred",
              },
            },
          ],
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "bound-object",
                binding: "target-unit",
              },
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: 4,
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

export default gildasFaeswornMonarch;
