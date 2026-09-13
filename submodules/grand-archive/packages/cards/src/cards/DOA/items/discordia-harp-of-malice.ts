import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const discordiaHarpOfMalice: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5LoOprBJay",
  slug: "discordia-harp-of-malice",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5LoOprBJay:face:default",
      catalogId: "5LoOprBJay",
      name: "Discordia, Harp of Malice",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "INSTRUMENT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Whenever you activate a Harmony or Melody card, put a music counter on Discordia.\n\nREST: Target champion gets -X level and your champion gets +X level until end of turn, where X is the amount of music counters on Discordia. At the beginning of the next end phase, banish Discordia.",
      abilities: [
        {
          id: "5LoOprBJay-a1",
          kind: "triggered",
          text: "Whenever you activate a Harmony or Melody card, put a music counter on Discordia.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["HARMONY", "MELODY"],
                },
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "music",
            },
            amount: 1,
          },
        },
        {
          id: "5LoOprBJay-a2",
          kind: "activated",
          text: "REST: Target champion gets -X level and your champion gets +X level until end of turn, where X is the amount of music counters on Discordia. At the beginning of the next end phase, banish Discordia.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-champion",
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
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "music",
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
                  binding: "target-champion",
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
                  property: "level",
                  operation: "subtract",
                  amount: {
                    kind: "counter-count",
                    subject: {
                      kind: "source",
                    },
                    counter: {
                      named: "music",
                    },
                  },
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "champion",
                  player: "controller",
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
                  property: "level",
                  operation: "add",
                  amount: {
                    kind: "counter-count",
                    subject: {
                      kind: "source",
                    },
                    counter: {
                      named: "music",
                    },
                  },
                },
              },
              {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "phase-begins",
                    phase: "end",
                  },
                },
                limit: 1,
                expires: {
                  kind: "until-end-of-next-phase",
                  phase: "end",
                },
                effect: {
                  kind: "banish-object",
                  subject: {
                    kind: "source",
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

export default discordiaHarpOfMalice;
