import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lostWisdom: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8codb9zatv",
  slug: "lost-wisdom",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8codb9zatv:face:default",
      catalogId: "8codb9zatv",
      name: "Lost Wisdom",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate if you control one or more unique allies.\n\nReturn a Spell card from your graveyard to your memory.",
      abilities: [
        {
          id: "8codb9zatv-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate if you control one or more unique allies.",
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
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
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
                        kind: "supertype",
                        oneOf: ["UNIQUE"],
                      },
                    ],
                  },
                },
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
          id: "8codb9zatv-a2",
          kind: "card-resolution",
          text: "Return a Spell card from your graveyard to your memory.",
          effect: {
            kind: "choose",
            selection: {
              id: "returned-card",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["graveyard"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["SPELL"],
                },
              },
            },
            effect: {
              kind: "move",
              subject: {
                kind: "bound",
                binding: "returned-card",
              },
              from: "graveyard",
              destination: {
                zone: "memory",
              },
            },
          },
        },
      ],
    },
  },
};

export default lostWisdom;
