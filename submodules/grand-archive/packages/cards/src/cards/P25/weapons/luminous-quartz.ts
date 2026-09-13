import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const luminousQuartz: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "40lgjj1yS3",
  slug: "luminous-quartz",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "40lgjj1yS3:face:default",
      catalogId: "40lgjj1yS3",
      name: "Luminous Quartz",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SWORD"],
      },
      elements: ["CRUX"],
      stats: {
        power: 2,
        durability: 3,
      },
      rulesText:
        "As long as Luminous Quartz is rested, it can't be used for an attack.\n\n[Sheen 12+]  REST, Remove a preparation counter from your champion: As a Spell, deal 1+X damage to target unit, where X is the amount of sheen counters on it. Activate this ability only at slow speed.",
      abilities: [
        {
          id: "40lgjj1yS3-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as Luminous Quartz is rested, it can't be used for an attack.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "use-for-attack",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "rested",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "40lgjj1yS3-a2",
          kind: "activated",
          text: "[Sheen 12+]  REST, Remove a preparation counter from your champion: As a Spell, deal 1+X damage to target unit, where X is the amount of sheen counters on it. Activate this ability only at slow speed.",
          activation: "ability",
          speed: "slow",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "remove-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "preparation",
                amount: 1,
              },
            ],
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
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "sheen-restriction",
              condition: {
                kind: "mastery-has-counter",
                mastery: "Fractured Memories",
                counter: {
                  named: "sheen",
                },
                minimum: 12,
              },
            },
          ],
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: {
                kind: "calculate",
                operator: "add",
                operands: [
                  1,
                  {
                    kind: "variable",
                    symbol: "X",
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
};

export default luminousQuartz;
