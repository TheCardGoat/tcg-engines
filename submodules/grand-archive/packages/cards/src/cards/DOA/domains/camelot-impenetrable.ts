import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const camelotImpenetrable: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "R9UFbI4Fsh",
  slug: "camelot-impenetrable",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "R9UFbI4Fsh:face:default",
      catalogId: "R9UFbI4Fsh",
      name: "Camelot, Impenetrable",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "CASTLE"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "Upkeep — Whenever you materialize a card, sacrifice Camelot.\n\nWhenever you activate a wind element card, you may negate its activation. If you do, choose an ally and suppress it.",
      abilities: [
        {
          id: "R9UFbI4Fsh-a1",
          kind: "triggered",
          text: "Upkeep — Whenever you materialize a card, sacrifice Camelot.",
          trigger: {
            kind: "event",
            event: {
              name: "card-materialized",
              actor: "controller",
              subject: {
                kind: "event-object",
              },
            },
          },
          effect: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          label: {
            name: "Upkeep",
          },
        },
        {
          id: "R9UFbI4Fsh-a2",
          kind: "triggered",
          text: "Whenever you activate a wind element card, you may negate its activation. If you do, choose an ally and suppress it.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "element",
                  oneOf: ["WIND"],
                },
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "negate",
                  subject: {
                    kind: "event-subject",
                  },
                },
                {
                  kind: "choose",
                  selection: {
                    id: "chosen-ally",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      relationship: "zone-of",
                      player: "each-player",
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                    },
                  },
                  effect: {
                    kind: "keyword-action",
                    action: "suppress",
                    subject: {
                      kind: "bound",
                      binding: "chosen-ally",
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default camelotImpenetrable;
