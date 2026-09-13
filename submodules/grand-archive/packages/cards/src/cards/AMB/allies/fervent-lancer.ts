import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ferventLancer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "aws20fsihd",
  slug: "fervent-lancer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "aws20fsihd:face:default",
      catalogId: "aws20fsihd",
      name: "Fervent Lancer",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["EXIA"],
      stats: {
        power: 3,
        life: 3,
      },
      rulesText:
        "Whenever you activate an exia element card, you may banish it as it resolves.\n\nAs long as there's a card banished by Fervent Lancer, it gets +2 POWER and must attack a champion each turn if able.",
      abilities: [
        {
          id: "aws20fsihd-a1",
          kind: "triggered",
          text: "Whenever you activate an exia element card, you may banish it as it resolves.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "element",
                  oneOf: ["EXIA"],
                },
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "after-resolution",
              stackItem: {
                kind: "event-subject",
              },
              effect: {
                kind: "banish-object",
                subject: {
                  kind: "event-subject",
                },
              },
            },
          },
        },
        {
          id: "aws20fsihd-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as there's a card banished by Fervent Lancer, it gets +2 POWER and must attack a champion each turn if able.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["banishment"],
                  host: {
                    kind: "source",
                  },
                  relationship: "banished-by",
                },
              },
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
            {
              kind: "rule-modification",
              mode: "require",
              action: "attack",
              subject: {
                kind: "source",
              },
              against: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["banishment"],
                  host: {
                    kind: "source",
                  },
                  relationship: "banished-by",
                },
              },
              requiredCount: {
                minimum: 1,
                per: "turn",
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

export default ferventLancer;
