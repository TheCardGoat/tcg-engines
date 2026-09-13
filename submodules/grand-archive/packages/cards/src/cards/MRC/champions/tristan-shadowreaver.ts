import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tristanShadowreaver: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4upufooz13",
  slug: "tristan-shadowreaver",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4upufooz13:face:default",
      catalogId: "4upufooz13",
      name: "Tristan, Shadowreaver",
      lineageName: "Tristan",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["UMBRA"],
      stats: {
        level: 3,
        life: 25,
      },
      rulesText:
        "Tristan Lineage\n\nTristan can level up into champions of the same base level. When she does, draw two cards.\n\nOn Enter: Banish the top four cards of target opponent’s deck face down. As long as they’re banished, you may play those cards, ignoring their elemental requirements.",
      abilities: [
        {
          id: "4upufooz13-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Tristan Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Tristan",
          },
        },
        {
          id: "4upufooz13-a2",
          kind: "composite",
          text: "Tristan can level up into champions of the same base level. When she does, draw two cards.",
          abilities: [
            {
              id: "4upufooz13-a10002",
              kind: "static",
              staticKind: "effects",
              text: "Tristan, Shadowreaver can level up into champions of the same base level.",
              effects: [
                {
                  kind: "rule-modification",
                  mode: "allow",
                  action: "level-up",
                  subject: {
                    kind: "source",
                  },
                  destinationFilter: {
                    kind: "numeric",
                    comparison: {
                      left: {
                        kind: "property",
                        subject: {
                          kind: "candidate",
                        },
                        property: "level",
                        basis: "base",
                      },
                      operator: "eq",
                      right: {
                        kind: "property",
                        subject: {
                          kind: "source",
                        },
                        property: "level",
                        basis: "base",
                      },
                    },
                  },
                  duration: {
                    kind: "while-source-in-functional-zone",
                  },
                },
              ],
            },
            {
              id: "4upufooz13-a10003",
              kind: "triggered",
              text: "When Tristan, Shadowreaver levels up this way, draw two cards.",
              trigger: {
                kind: "event",
                event: {
                  name: "champion-leveled-up",
                  actor: "controller",
                  previousObject: {
                    kind: "source",
                  },
                },
              },
              effect: {
                kind: "draw",
                player: "controller",
                amount: 2,
              },
            },
          ],
        },
        {
          id: "4upufooz13-a3",
          kind: "triggered",
          text: "On Enter: Banish the top four cards of target opponent’s deck face down. As long as they’re banished, you may play those cards, ignoring their elemental requirements.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-opponent",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["opponent"],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "banish",
                player: {
                  binding: "target-opponent",
                },
                selection: {
                  id: "banished-opponent-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 4,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: {
                      binding: "target-opponent",
                    },
                    fromTop: true,
                  },
                },
                faceDown: true,
                bindResultAs: "banished-opponent-cards",
              },
              {
                kind: "rule-modification",
                mode: "allow",
                action: "play",
                subject: {
                  kind: "bound",
                  binding: "banished-opponent-cards",
                },
                fromZone: "banishment",
                duration: {
                  kind: "while-subjects-in-zone",
                  subjects: {
                    kind: "bound",
                    binding: "banished-opponent-cards",
                  },
                  zone: "banishment",
                  scope: "per-object",
                },
              },
              {
                kind: "rule-modification",
                mode: "allow",
                action: "ignore-element-requirement",
                subject: {
                  kind: "bound",
                  binding: "banished-opponent-cards",
                },
                fromZone: "banishment",
                duration: {
                  kind: "while-subjects-in-zone",
                  subjects: {
                    kind: "bound",
                    binding: "banished-opponent-cards",
                  },
                  zone: "banishment",
                  scope: "per-object",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default tristanShadowreaver;
