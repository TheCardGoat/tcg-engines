import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tricksterOfTheFaeRealm: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "RfML5wAB1y",
  slug: "trickster-of-the-fae-realm",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "RfML5wAB1y:face:default",
      catalogId: "RfML5wAB1y",
      name: "Trickster of the Fae Realm",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FAIRY"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Stealth\n\nOn Enter: Look at the top five cards of target opponent's deck. Banish up to two of them and put the rest back on top of their owner's deck in any order.\n\nOn Leave: Return the banished cards to the top of their owner's deck in any order.",
      abilities: [
        {
          id: "RfML5wAB1y-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Stealth",
          keyword: {
            name: "stealth",
          },
        },
        {
          id: "RfML5wAB1y-a2",
          kind: "triggered",
          text: "On Enter: Look at the top five cards of target opponent's deck. Banish up to two of them and put the rest back on top of their owner's deck in any order.",
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
                kind: "look-at",
                player: {
                  binding: "target-opponent",
                },
                selection: {
                  id: "looked-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 5,
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
                  id: "banished-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 2,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "looked-cards",
                  },
                },
                effect: {
                  kind: "banish-object",
                  subject: {
                    kind: "bound",
                    binding: "banished-cards",
                  },
                  bindResultAs: "banished-cards",
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "binding-remainder",
                  binding: "looked-cards",
                  excluding: "banished-cards",
                },
                destination: {
                  zone: "main-deck",
                  placement: {
                    kind: "top",
                    orderChosenBy: "controller",
                  },
                },
              },
            ],
          },
        },
        {
          id: "RfML5wAB1y-a3",
          kind: "triggered",
          text: "On Leave: Return the banished cards to the top of their owner's deck in any order.",
          trigger: {
            kind: "event",
            event: {
              name: "object-left-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "move",
            subject: {
              kind: "tracked",
              key: "banished-cards",
            },
            from: "banishment",
            destination: {
              zone: "main-deck",
              placement: {
                kind: "top",
                orderChosenBy: "controller",
              },
            },
          },
        },
      ],
    },
  },
};

export default tricksterOfTheFaeRealm;
