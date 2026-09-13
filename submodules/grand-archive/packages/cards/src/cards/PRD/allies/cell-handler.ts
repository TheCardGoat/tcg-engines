import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cellHandler: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pk9xycwz9g",
  slug: "cell-handler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pk9xycwz9g:face:default",
      catalogId: "pk9xycwz9g",
      name: "Cell Handler",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "AUTOMATON"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText:
        "[Class Bonus] On Enter: Up to one target Animal or Beast ally you control loses pride and gets -1 POWER until end of turn. If that ally is an Automaton, summon a Powercell token rested.",
      abilities: [
        {
          id: "pk9xycwz9g-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Up to one target Animal or Beast ally you control loses pride and gets -1 POWER until end of turn. If that ally is an Automaton, summon a Powercell token rested.",
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
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "any",
                      filters: [
                        {
                          kind: "subtype",
                          oneOf: ["ANIMAL"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["BEAST"],
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
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
                  operation: "subtract",
                  amount: 1,
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  filter: {
                    kind: "subtype",
                    oneOf: ["AUTOMATON"],
                  },
                },
                then: {
                  kind: "summon",
                  object: "Powercell",
                  controller: "controller",
                  bindResultAs: "summoned-token",
                  entersWithStates: ["rested"],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default cellHandler;
