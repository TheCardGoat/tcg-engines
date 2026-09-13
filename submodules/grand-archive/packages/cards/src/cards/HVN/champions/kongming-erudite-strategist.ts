import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const kongmingEruditeStrategist: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0i139x5eub",
  slug: "kongming-erudite-strategist",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0i139x5eub:face:default",
      catalogId: "0i139x5eub",
      name: "Kongming, Erudite Strategist",
      lineageName: "Kongming",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 22,
      },
      rulesText:
        "Kongming Lineage\n\nOn Enter: Banish the top card of your deck. Until the beginning of your next turn, you may play it as long as your Shifting Currents face North. Repeat this process for East, South, and West.\n",
      abilities: [
        {
          id: "0i139x5eub-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Kongming Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Kongming",
          },
        },
        {
          id: "0i139x5eub-a2",
          kind: "triggered",
          text: "On Enter: Banish the top card of your deck. Until the beginning of your next turn, you may play it as long as your Shifting Currents face North. Repeat this process for East, South, and West.",
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
                kind: "sequence",
                effects: [
                  {
                    kind: "banish",
                    player: "controller",
                    selection: {
                      id: "banished-north-card",
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
                    bindResultAs: "banished-north-card",
                  },
                  {
                    kind: "rule-modification",
                    mode: "allow",
                    action: "play",
                    subject: {
                      kind: "bound",
                      binding: "banished-north-card",
                    },
                    fromZone: "banishment",
                    condition: {
                      kind: "player-state",
                      player: "controller",
                      state: {
                        named: "shifting-currents",
                        value: "north",
                      },
                    },
                    duration: {
                      kind: "until-start-of-turn",
                      whose: "controller",
                    },
                  },
                ],
              },
              {
                kind: "sequence",
                effects: [
                  {
                    kind: "banish",
                    player: "controller",
                    selection: {
                      id: "banished-east-card",
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
                    bindResultAs: "banished-east-card",
                  },
                  {
                    kind: "rule-modification",
                    mode: "allow",
                    action: "play",
                    subject: {
                      kind: "bound",
                      binding: "banished-east-card",
                    },
                    fromZone: "banishment",
                    condition: {
                      kind: "player-state",
                      player: "controller",
                      state: {
                        named: "shifting-currents",
                        value: "east",
                      },
                    },
                    duration: {
                      kind: "until-start-of-turn",
                      whose: "controller",
                    },
                  },
                ],
              },
              {
                kind: "sequence",
                effects: [
                  {
                    kind: "banish",
                    player: "controller",
                    selection: {
                      id: "banished-south-card",
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
                    bindResultAs: "banished-south-card",
                  },
                  {
                    kind: "rule-modification",
                    mode: "allow",
                    action: "play",
                    subject: {
                      kind: "bound",
                      binding: "banished-south-card",
                    },
                    fromZone: "banishment",
                    condition: {
                      kind: "player-state",
                      player: "controller",
                      state: {
                        named: "shifting-currents",
                        value: "south",
                      },
                    },
                    duration: {
                      kind: "until-start-of-turn",
                      whose: "controller",
                    },
                  },
                ],
              },
              {
                kind: "sequence",
                effects: [
                  {
                    kind: "banish",
                    player: "controller",
                    selection: {
                      id: "banished-west-card",
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
                    bindResultAs: "banished-west-card",
                  },
                  {
                    kind: "rule-modification",
                    mode: "allow",
                    action: "play",
                    subject: {
                      kind: "bound",
                      binding: "banished-west-card",
                    },
                    fromZone: "banishment",
                    condition: {
                      kind: "player-state",
                      player: "controller",
                      state: {
                        named: "shifting-currents",
                        value: "west",
                      },
                    },
                    duration: {
                      kind: "until-start-of-turn",
                      whose: "controller",
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  },
};

export default kongmingEruditeStrategist;
