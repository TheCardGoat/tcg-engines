import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spiritBladeInfusion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "CgyJxpEgzk",
  slug: "spirit-blade-infusion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "CgyJxpEgzk:face:default",
      catalogId: "CgyJxpEgzk",
      name: "Spirit Blade: Infusion",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPELL"],
      },
      elements: ["CRUX"],
      speed: "fast",
      stats: {},
      rulesText:
        'This card costs 2 less to activate if your champion has dealt combat damage this turn.\n\nUntil end of turn, target Sword weapon gets +3 POWER and "On Champion Hit: Draw a card."',
      abilities: [
        {
          id: "CgyJxpEgzk-a1",
          kind: "static",
          staticKind: "effects",
          text: "This card costs 2 less to activate if your champion has dealt combat damage this turn.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "history",
                event: "damage-dealt",
                window: "this-turn",
                actor: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
                combatDamage: true,
                minimum: 1,
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "CgyJxpEgzk-a2",
          kind: "card-resolution",
          text: 'Until end of turn, target Sword weapon gets +3 POWER and "On Champion Hit: Draw a card."',
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SWORD"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-1",
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
                  amount: 3,
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-1",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-ability",
                  ability: {
                    id: "granted-1kdbmad-a1",
                    kind: "triggered",
                    text: "On Champion Hit: Draw a card.",
                    trigger: {
                      kind: "event",
                      event: {
                        name: "attack-hit",
                        subject: {
                          kind: "source",
                        },
                        recipient: {
                          kind: "event-object",
                          bindAs: "trigger-recipient",
                          filter: {
                            kind: "type",
                            oneOf: ["CHAMPION"],
                          },
                        },
                      },
                    },
                    effect: {
                      kind: "draw",
                      player: "controller",
                      amount: 1,
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default spiritBladeInfusion;
