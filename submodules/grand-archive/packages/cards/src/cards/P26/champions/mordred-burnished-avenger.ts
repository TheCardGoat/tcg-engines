import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mordredBurnishedAvenger: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "OWCdWq3mXY",
  slug: "mordred-burnished-avenger",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "OWCdWq3mXY:face:default",
      catalogId: "OWCdWq3mXY",
      name: "Mordred, Burnished Avenger",
      lineageName: "Mordred",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        level: 1,
        life: 20,
      },
      rulesText:
        "Flawless Spirit of Mordred Lineage\n\nOn Enter: Look at the top card of your deck. If its an attack card, you may banish it. If you do, you may activate that card this turn.\n\n[Mordred Bonus] Inherited Effect — As long as Mordred has leveled up this turn, the first attack card you activate this turn costs 2 less to activate.",
      abilities: [
        {
          id: "OWCdWq3mXY-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Flawless Spirit of Mordred Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Flawless Spirit of Mordred",
          },
        },
        {
          id: "OWCdWq3mXY-a2",
          kind: "triggered",
          text: "On Enter: Look at the top card of your deck. If its an attack card, you may banish it. If you do, you may activate that card this turn.",
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
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "looked-at-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: "controller",
                    fromTop: true,
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "looked-at-card",
                  },
                  filter: {
                    kind: "type",
                    oneOf: ["ATTACK"],
                  },
                },
                then: {
                  kind: "optional",
                  player: "controller",
                  allOrNothing: true,
                  effect: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "move",
                        subject: {
                          kind: "bound",
                          binding: "looked-at-card",
                        },
                        from: "main-deck",
                        destination: {
                          zone: "banishment",
                        },
                      },
                      {
                        kind: "rule-modification",
                        mode: "allow",
                        action: "activate",
                        subject: {
                          kind: "bound",
                          binding: "looked-at-card",
                        },
                        duration: {
                          kind: "this-turn",
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
        {
          id: "OWCdWq3mXY-a3",
          kind: "static",
          staticKind: "effects",
          text: "[Mordred Bonus] Inherited Effect — As long as Mordred has leveled up this turn, the first attack card you activate this turn costs 2 less to activate.",
          executionSource: "lineage-host",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "player",
                player: "controller",
              },
              filter: {
                kind: "type",
                oneOf: ["ATTACK"],
              },
              condition: {
                kind: "history",
                event: "champion-leveled-up",
                window: "this-turn",
                subject: {
                  kind: "ability-bearer",
                },
                minimum: 1,
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              occurrence: {
                count: 1,
                window: "this-turn",
                actorScope: "same-player",
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

export default mordredBurnishedAvenger;
