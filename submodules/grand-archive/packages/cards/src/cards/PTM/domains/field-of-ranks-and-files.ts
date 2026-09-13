import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fieldOfRanksAndFiles: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "W0WfIEDs3n",
  slug: "field-of-ranks-and-files",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "W0WfIEDs3n:face:default",
      catalogId: "W0WfIEDs3n",
      name: "Field of Ranks and Files",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SIEGEABLE", "CHESSMAN", "CASTLE"],
      },
      elements: ["NORM"],
      stats: {
        durability: 4,
      },
      rulesText:
        "The first time a Chessman ally enters the field under your control during each of your turns, that ally gets +2 POWER until end of turn.\n\nThe first Chessman Command card you activate during each of your turns enters the intent with +2 POWER.",
      abilities: [
        {
          id: "W0WfIEDs3n-a1",
          kind: "triggered",
          text: "The first time a Chessman ally enters the field under your control during each of your turns, that ally gets +2 POWER until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              occurrence: {
                count: 1,
                window: "this-turn",
                actorScope: "same-player",
              },
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["CHESSMAN"],
                    },
                  ],
                },
              },
            },
          },
          interveningCondition: {
            kind: "turn-player",
            player: "controller",
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "event-subject",
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
              amount: 2,
            },
          },
        },
        {
          id: "W0WfIEDs3n-a2",
          kind: "static",
          staticKind: "effects",
          text: "The first Chessman Command card you activate during each of your turns enters the intent with +2 POWER.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "card-moved",
                actor: "controller",
                to: "intent",
                cause: {
                  kind: "card-activation",
                  controller: "controller",
                },
                subject: {
                  kind: "event-object",
                  controller: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "subtype",
                        oneOf: ["CHESSMAN"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["COMMAND"],
                      },
                    ],
                  },
                },
                occurrence: {
                  count: 1,
                  window: "this-turn",
                  actorScope: "same-player",
                },
              },
              operation: {
                kind: "modify-characteristic",
                change: {
                  kind: "numeric",
                  property: "power",
                  operation: "add",
                  amount: 2,
                },
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

export default fieldOfRanksAndFiles;
