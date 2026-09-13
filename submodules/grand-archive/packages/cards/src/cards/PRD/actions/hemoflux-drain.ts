import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hemofluxDrain: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zHhOcG9MfK",
  slug: "hemoflux-drain",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zHhOcG9MfK:face:default",
      catalogId: "zHhOcG9MfK",
      name: "Hemoflux Drain",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "AENEAN", "SPELL"],
      },
      elements: ["EXIA"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] [Damage 20+] This card costs 3 less to activate. (Apply this effect only if there are twenty or more damage counters on your champion.)\n\nDeal LV damage to target unit. Then recover X, where X is the amount of damage dealt this way.",
      abilities: [
        {
          id: "zHhOcG9MfK-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] [Damage 20+] This card costs 3 less to activate. (Apply this effect only if there are twenty or more damage counters on your champion.)",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
            {
              kind: "static",
              name: "damage-restriction",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "damage",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "damage",
                  },
                  operator: "gte",
                  right: 20,
                },
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
              costKind: "reserve",
              costOperation: "subtract",
              amount: 3,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "zHhOcG9MfK-a2",
          kind: "card-resolution",
          text: "Deal LV damage to target unit. Then recover X, where X is the amount of damage dealt this way.",
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
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "modified-ability-result-amount",
                metric: "damage-dealt",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-1",
                },
                amount: {
                  kind: "property",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  property: "level",
                  basis: "current",
                },
              },
              {
                kind: "recover",
                player: "controller",
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default hemofluxDrain;
