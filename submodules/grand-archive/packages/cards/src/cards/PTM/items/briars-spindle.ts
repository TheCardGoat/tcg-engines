import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const briarsSpindle: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9ooAGDhBj7",
  slug: "briars-spindle",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9ooAGDhBj7:face:default",
      catalogId: "9ooAGDhBj7",
      name: "Briar's Spindle",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "CHESSMAN", "ARTIFACT"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "Banish Briar's Spindle: Wake up each Chessman ally you control. Activate this ability only during an opponent's turn.\n\nREST: The next Chessman card you activate this turn costs (2) less to activate. Activate this ability only if you control a Chessman King ally.",
      abilities: [
        {
          id: "9ooAGDhBj7-a1",
          kind: "activated",
          text: "Banish Briar's Spindle: Wake up each Chessman ally you control. Activate this ability only during an opponent's turn.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          condition: {
            kind: "turn-player",
            player: "opponent",
          },
          effect: {
            kind: "choose",
            selection: {
              id: "woken-object",
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
                      kind: "subtype",
                      oneOf: ["CHESSMAN"],
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "wake",
              subject: {
                kind: "bound",
                binding: "woken-object",
              },
            },
          },
        },
        {
          id: "9ooAGDhBj7-a2",
          kind: "activated",
          text: "REST: The next Chessman card you activate this turn costs (2) less to activate. Activate this ability only if you control a Chessman King ally.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          condition: {
            kind: "collection-exists",
            collection: {
              zones: ["field"],
              player: "controller",
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                  {
                    kind: "subtype",
                    oneOf: ["KING"],
                  },
                ],
              },
            },
          },
          effect: {
            kind: "rule-modification",
            mode: "modify-cost",
            action: "activate",
            subject: {
              kind: "player",
              player: "controller",
            },
            filter: {
              kind: "subtype",
              oneOf: ["CHESSMAN"],
            },
            costKind: "reserve",
            costOperation: "subtract",
            amount: 2,
            duration: {
              kind: "for-next-event",
              event: "card-activated",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
      ],
    },
  },
};

export default briarsSpindle;
