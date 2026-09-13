import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const merlinMemoriteVassal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6R8XmWoKLn",
  slug: "merlin-memorite-vassal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6R8XmWoKLn:face:default",
      catalogId: "6R8XmWoKLn",
      name: "Merlin, Memorite Vassal",
      lineageName: "Merlin",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 1,
        life: 19,
      },
      rulesText:
        "On Enter: You gain the Fractured Memories mastery. Then you may pay (2). If you do, summon a Memorite Blade token.\n\n[Merlin Bonus] Inherited Effect — Whenever an opponent recollects three or more cards, for every three cards recollected, they put a sheen counter on a unit they control.\n\n",
      abilities: [
        {
          id: "6R8XmWoKLn-a1",
          kind: "triggered",
          text: "On Enter: You gain the Fractured Memories mastery. Then you may pay (2). If you do, summon a Memorite Blade token.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "gain-mastery",
                player: "controller",
                mastery: "Fractured Memories",
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "pay",
                      player: "controller",
                      cost: {
                        kind: "pay-reserve",
                        amount: 2,
                      },
                    },
                    {
                      kind: "summon",
                      object: "Memorite Blade",
                      controller: "controller",
                      bindResultAs: "summoned-token",
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          id: "6R8XmWoKLn-a2",
          kind: "triggered",
          text: "[Merlin Bonus] Inherited Effect — Whenever an opponent recollects three or more cards, for every three cards recollected, they put a sheen counter on a unit they control.",
          executionSource: "lineage-host",
          trigger: {
            kind: "event",
            event: {
              name: "cards-recollected",
              actor: "opponent",
              amountComparison: {
                left: {
                  kind: "event-amount",
                },
                operator: "gte",
                right: 3,
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
          ],
          effect: {
            kind: "repeat",
            count: {
              kind: "calculate",
              operator: "divide",
              operands: [
                {
                  kind: "event-amount",
                },
                3,
              ],
              rounding: "down",
            },
            effect: {
              kind: "choose",
              selection: {
                id: "sheen-unit",
                kind: "choice",
                declared: "resolution",
                chooser: "event-actor",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                unique: true,
                candidates: {
                  kind: "object",
                  zones: ["field"],
                  relationship: "controlled-by",
                  player: "event-actor",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY", "CHAMPION"],
                  },
                },
              },
              effect: {
                kind: "add-counter",
                subject: {
                  kind: "bound",
                  binding: "sheen-unit",
                },
                counter: {
                  named: "sheen",
                },
                amount: 1,
              },
            },
          },
        },
      ],
    },
  },
};

export default merlinMemoriteVassal;
