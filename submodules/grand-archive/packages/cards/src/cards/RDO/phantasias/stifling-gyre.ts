import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stiflingGyre: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "OADTyAUBZt",
  slug: "stifling-gyre",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "OADTyAUBZt:face:default",
      catalogId: "OADTyAUBZt",
      name: "Stifling Gyre",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "As Stifling Gyre enters the field, choose an ally card name.\n\nOn Enter: Draw a card into your memory.\n\nWhenever an on enter ability of an ally with the chosen name triggers, negate that trigger unless its controller pays (4).\n\n",
      abilities: [
        {
          id: "OADTyAUBZt-a1",
          kind: "static",
          staticKind: "effects",
          text: "As Stifling Gyre enters the field, choose an ally card name.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              operation: {
                kind: "perform-before-commit",
                effect: {
                  kind: "choose-value",
                  selection: {
                    id: "entry-choice",
                    kind: "choice",
                    declared: "event-processing",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "characteristic",
                      characteristic: "card-name",
                      optionsFrom: {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                    },
                  },
                  trackAs: "chosen-card-name",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "OADTyAUBZt-a2",
          kind: "triggered",
          text: "On Enter: Draw a card into your memory.",
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
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
        {
          id: "OADTyAUBZt-a3",
          kind: "triggered",
          text: "Whenever an on enter ability of an ally with the chosen name triggers, negate that trigger unless its controller pays (4).",
          trigger: {
            kind: "event",
            event: {
              name: "ability-triggered",
              triggerName: "on-enter",
              sourceObject: {
                kind: "event-object",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "matches-tracked-characteristic",
                      key: "chosen-card-name",
                      characteristic: "card-name",
                    },
                  ],
                },
              },
            },
          },
          effect: {
            kind: "unless-paid",
            player: "event-actor",
            cost: {
              kind: "pay-reserve",
              amount: 4,
            },
            otherwise: {
              kind: "negate",
              subject: {
                kind: "event-subject",
              },
            },
          },
        },
      ],
    },
  },
};

export default stiflingGyre;
