import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const crossroadsSpecter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "r3i9nmxhnb",
  slug: "crossroads-specter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "r3i9nmxhnb:face:default",
      catalogId: "r3i9nmxhnb",
      name: "Crossroads Specter",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER"],
      },
      elements: ["CRUX"],
      stats: {
        power: 3,
        life: 3,
      },
      rulesText:
        "On Champion Hit: That opponent banishes a card from their material deck.\n\nOn Death: If there are seven or more regalia cards among all banishments, return Crossroads Specter to the field with a buff counter on it. It becomes ephemeral. ",
      abilities: [
        {
          id: "r3i9nmxhnb-a1",
          kind: "triggered",
          text: "On Champion Hit: That opponent banishes a card from their material deck.",
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
            kind: "banish",
            player: "event-recipient-controller",
            selection: {
              id: "banished-cards",
              kind: "choice",
              declared: "resolution",
              chooser: "event-recipient-controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["material-deck"],
                relationship: "zone-of",
                player: "event-recipient-controller",
              },
            },
          },
        },
        {
          id: "r3i9nmxhnb-a2",
          kind: "triggered",
          text: "On Death: If there are seven or more regalia cards among all banishments, return Crossroads Specter to the field with a buff counter on it. It becomes ephemeral.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "count",
                      collection: {
                        zones: ["banishment"],
                        player: "each-player",
                        filter: {
                          kind: "supertype",
                          oneOf: ["REGALIA"],
                        },
                      },
                    },
                    operator: "gte",
                    right: 7,
                  },
                },
                then: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "move",
                      subject: {
                        kind: "source",
                      },
                      from: "graveyard",
                      destination: {
                        zone: "field",
                      },
                    },
                    {
                      kind: "add-counter",
                      subject: {
                        kind: "source",
                      },
                      counter: "buff",
                      amount: 1,
                    },
                  ],
                },
              },
              {
                kind: "set-object-state",
                subject: {
                  kind: "source",
                },
                state: "ephemeral",
                value: true,
              },
            ],
          },
        },
      ],
    },
  },
};

export default crossroadsSpecter;
