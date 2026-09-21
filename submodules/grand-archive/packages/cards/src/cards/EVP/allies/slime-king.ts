import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const slimeKing: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "f0ymeslfpw",
  slug: "slime-king",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "f0ymeslfpw:face:default",
      catalogId: "f0ymeslfpw",
      name: "Slime King",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "SLIME"],
      },
      elements: ["TERA"],
      stats: {
        power: 4,
        life: 5,
      },
      rulesText:
        "As an additional cost to activate this card, banish three Slime ally cards each with different elements from your graveyard.\n\nPride 4, Taunt\n\n[Element Bonus] On Leave: You may put any number of the Slime ally cards banished by Slime King onto the field under your control.",
      abilities: [
        {
          id: "f0ymeslfpw-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, banish three Slime ally cards each with different elements from your graveyard.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-move",
                player: "controller",
                from: "graveyard",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 3,
                },
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SLIME"],
                    },
                  ],
                },
                distinctBy: "element",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "f0ymeslfpw-a2",
          kind: "keyword-group",
          text: "Pride 4, Taunt",
          keywords: [
            {
              name: "pride",
              value: 4,
            },
            {
              name: "taunt",
            },
          ],
        },
        {
          id: "f0ymeslfpw-a3",
          kind: "triggered",
          text: "[Element Bonus] On Leave: You may put any number of the Slime ally cards banished by Slime King onto the field under your control.",
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
              name: "element-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "element",
              },
            },
          ],
          effect: {
            kind: "choose",
            selection: {
              id: "chosen-banished-slimes",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "any-number",
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["banishment"],
                relationship: "activation-payment-of",
                host: {
                  kind: "source",
                },
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SLIME"],
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "move",
              subject: {
                kind: "bound",
                binding: "chosen-banished-slimes",
              },
              destination: {
                zone: "field",
                controller: "controller",
              },
            },
          },
        },
      ],
    },
  },
};

export default slimeKing;
