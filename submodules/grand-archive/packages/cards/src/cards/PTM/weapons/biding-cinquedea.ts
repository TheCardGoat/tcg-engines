import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bidingCinquedea: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uqICHZa3Wz",
  slug: "biding-cinquedea",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "uqICHZa3Wz:face:default",
      catalogId: "uqICHZa3Wz",
      name: "Biding Cinquedea",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 1,
      },
      rulesText:
        "[Class Bonus] On Charge 2: Biding Cinquedea gets +1POWER until end of turn. Then put a preparation counter on your champion. (At the beginning of your recollection phase, put a charge counter on each object you control with an untriggered on charge ability. Trigger this ability the first time two charge counters are on it.)",
      abilities: [
        {
          id: "uqICHZa3Wz-a1",
          kind: "triggered",
          text: "[Class Bonus] On Charge 2: Biding Cinquedea gets +1POWER until end of turn. Then put a preparation counter on your champion. (At the beginning of your recollection phase, put a charge counter on each object you control with an untriggered on charge ability. Trigger this ability the first time two charge counters are on it.)",
          label: {
            name: "On Charge",
            parameters: {
              threshold: 2,
            },
          },
          trigger: {
            kind: "event",
            event: {
              name: "counter-added",
              subject: {
                kind: "source",
              },
              counter: {
                named: "charge",
              },
            },
          },
          limit: {
            count: 1,
            per: "source-instance",
          },
          interveningCondition: {
            kind: "has-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "charge",
            },
            comparison: {
              left: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "charge",
                },
              },
              operator: "gte",
              right: 2,
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
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "source",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
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
                  amount: 1,
                },
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "preparation",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default bidingCinquedea;
