import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const incarnateMajesty: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7dl5j4lx6x",
  slug: "incarnate-majesty",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7dl5j4lx6x:face:default",
      catalogId: "7dl5j4lx6x",
      name: "Incarnate Majesty",
      cost: {
        kind: "reserve",
        amount: 12,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["CRUX"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] Efficiency\n\nThis card costs 1 less to activate for each regalia weapon card in your banishment.\n\nPut a card named The Majestic Spirit from your material deck or banishment onto the field.",
      abilities: [
        {
          id: "7dl5j4lx6x-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Efficiency",
          keyword: {
            name: "efficiency",
          },
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
        },
        {
          id: "7dl5j4lx6x-a2",
          kind: "static",
          staticKind: "effects",
          text: "This card costs 1 less to activate for each regalia weapon card in your banishment.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: {
                kind: "count",
                collection: {
                  zones: ["banishment"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["WEAPON"],
                      },
                      {
                        kind: "supertype",
                        oneOf: ["REGALIA"],
                      },
                    ],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "7dl5j4lx6x-a3",
          kind: "card-resolution",
          text: "Put a card named The Majestic Spirit from your material deck or banishment onto the field.",
          effect: {
            kind: "choose",
            selection: {
              id: "chosen-multi-zone-card",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["material-deck", "banishment"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "name",
                  value: "The Majestic Spirit",
                },
              },
            },
            effect: {
              kind: "move",
              subject: {
                kind: "bound",
                binding: "chosen-multi-zone-card",
              },
              destination: {
                zone: "field",
              },
            },
          },
        },
      ],
    },
  },
};

export default incarnateMajesty;
