import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const turmSchwartzRook: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rYyOEGB3tD",
  slug: "turm-schwartz-rook",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rYyOEGB3tD:face:default",
      catalogId: "rYyOEGB3tD",
      name: "Turm, Schwartz Rook",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "CHESSMAN", "ROOK", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Whenever Turm attacks with a Command card, put a buff counter on Turm.\n\n[Alice Bonus] On Leave: Put the buff counters that were on Turm on a Pawn ally you control.",
      abilities: [
        {
          id: "rYyOEGB3tD-a1",
          kind: "triggered",
          text: "Whenever Turm attacks with a Command card, put a buff counter on Turm.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
              using: {
                kind: "event-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["COMMAND"],
                },
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: "buff",
            amount: 1,
          },
        },
        {
          id: "rYyOEGB3tD-a2",
          kind: "triggered",
          text: "[Alice Bonus] On Leave: Put the buff counters that were on Turm on a Pawn ally you control.",
          trigger: {
            kind: "event",
            event: {
              name: "object-left-field",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
          effect: {
            kind: "choose",
            selection: {
              id: "chosen-object",
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
                      oneOf: ["PAWN"],
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "move-counter",
              from: {
                kind: "event-source",
              },
              to: {
                kind: "bound",
                binding: "chosen-object",
              },
              counter: "buff",
              amount: {
                kind: "all",
              },
            },
          },
        },
      ],
    },
  },
};

export default turmSchwartzRook;
