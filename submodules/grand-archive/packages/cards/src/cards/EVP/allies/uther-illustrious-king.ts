import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const utherIllustriousKing: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5h8asbierp",
  slug: "uther-illustrious-king",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5h8asbierp:face:default",
      catalogId: "5h8asbierp",
      name: "Uther, Illustrious King",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["LUXEM"],
      stats: {
        power: 4,
        life: 4,
      },
      rulesText:
        "Intercept, Vigor\n\nOn Enter: You may rest Uther. When you do, banish another target non-champion object.\n\nOn Leave: Return the banished object to the field under its owner's control rested.",
      abilities: [
        {
          id: "5h8asbierp-a1",
          kind: "keyword-group",
          text: "Intercept, Vigor",
          keywords: [
            {
              name: "intercept",
            },
            {
              name: "vigor",
            },
          ],
        },
        {
          id: "5h8asbierp-a2",
          kind: "triggered",
          text: "On Enter: You may rest Uther. When you do, banish another target non-champion object.",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "reflexive",
              action: {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              consequence: {
                kind: "banish-object",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                bindResultAs: "banished-object",
              },
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
                          kind: "not",
                          filter: {
                            kind: "type",
                            oneOf: ["CHAMPION"],
                          },
                        },
                        {
                          kind: "not-source",
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
        {
          id: "5h8asbierp-a3",
          kind: "triggered",
          text: "On Leave: Return the banished object to the field under its owner's control rested.",
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
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "tracked",
                  key: "banished-object",
                },
                from: "banishment",
                destination: {
                  zone: "field",
                },
              },
              {
                kind: "rest",
                subject: {
                  kind: "tracked",
                  key: "banished-object",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default utherIllustriousKing;
