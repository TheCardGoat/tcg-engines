import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const peerTheDepths: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6JMwc6cpRm",
  slug: "peer-the-depths",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6JMwc6cpRm:face:default",
      catalogId: "6JMwc6cpRm",
      name: "Peer the Depths",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Activate this card only during your recollection phase.\n\nTarget opponent skips their next draw phase. Look at the top four cards of that player's deck and banish a card from among them. Put the rest on the bottom of their deck in any order. Until the end of that player's next turn, they may activate the banished card, ignoring its elemental requirements.",
      abilities: [
        {
          id: "6JMwc6cpRm-a1",
          kind: "static",
          staticKind: "effects",
          text: "Activate this card only during your recollection phase.",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "phase",
                    phase: "recollection",
                  },
                  {
                    kind: "turn-player",
                    player: "controller",
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "6JMwc6cpRm-a2",
          kind: "card-resolution",
          text: "Target opponent skips their next draw phase. Look at the top four cards of that player's deck and banish a card from among them. Put the rest on the bottom of their deck in any order. Until the end of that player's next turn, they may activate the banished card, ignoring its elemental requirements.",
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
                kind: "skip-next-phase",
                player: {
                  binding: "target-opponent",
                },
                phase: "draw",
              },
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "looked-at-cards",
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
              },
              {
                kind: "choose",
                selection: {
                  id: "banished-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "looked-at-cards",
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "banished-card",
                  },
                  from: "main-deck",
                  destination: {
                    zone: "banishment",
                  },
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "binding-remainder",
                  binding: "looked-at-cards",
                  excluding: "banished-card",
                },
                destination: {
                  zone: "main-deck",
                  placement: {
                    kind: "bottom",
                    orderChosenBy: "controller",
                  },
                },
              },
              {
                kind: "rule-modification",
                mode: "allow",
                action: "activate",
                subject: {
                  kind: "bound",
                  binding: "banished-card",
                },
                duration: {
                  kind: "until-end-of-turn",
                  whose: {
                    binding: "target-opponent",
                  },
                },
              },
              {
                kind: "rule-modification",
                mode: "allow",
                action: "ignore-element-requirement",
                subject: {
                  kind: "bound",
                  binding: "banished-card",
                },
                duration: {
                  kind: "until-end-of-turn",
                  whose: {
                    binding: "target-opponent",
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

export default peerTheDepths;
