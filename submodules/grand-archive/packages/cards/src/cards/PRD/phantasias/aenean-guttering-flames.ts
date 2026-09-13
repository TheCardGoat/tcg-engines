import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aeneanGutteringFlames: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "JGQ9LO5DFv",
  slug: "aenean-guttering-flames",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "JGQ9LO5DFv:face:default",
      catalogId: "JGQ9LO5DFv",
      name: "Aenean Guttering Flames",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "AENEAN", "SPELL"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "[Class Bonus] [Level 3+] This card costs 2 less to activate.\n\nOn Enter: Draw a card, then discard a card.\n\n[Class Bonus] If a fire element Aenean Spell source you control would deal damage, it deals that much damage plus 1 instead.",
      abilities: [
        {
          id: "JGQ9LO5DFv-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] [Level 3+] This card costs 2 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 3,
                },
              },
            },
          ],
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
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "JGQ9LO5DFv-a2",
          kind: "triggered",
          text: "On Enter: Draw a card, then discard a card.",
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
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "discard",
                player: "controller",
                selection: {
                  id: "discarded-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["hand"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
                bindResultAs: "discarded-card",
              },
            ],
          },
        },
        {
          id: "JGQ9LO5DFv-a3",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] If a fire element Aenean Spell source you control would deal damage, it deals that much damage plus 1 instead.",
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
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                subject: {
                  kind: "event-object",
                  controller: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "element",
                        oneOf: ["FIRE"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SPELL"],
                      },
                    ],
                  },
                },
              },
              operation: {
                kind: "modify-amount",
                operation: "add",
                amount: 1,
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

export default aeneanGutteringFlames;
