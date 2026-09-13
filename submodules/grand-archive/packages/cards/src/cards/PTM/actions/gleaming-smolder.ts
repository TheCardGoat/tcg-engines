import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gleamingSmolder: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "THjSE7caau",
  slug: "gleaming-smolder",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "THjSE7caau:face:default",
      catalogId: "THjSE7caau",
      name: "Gleaming Smolder",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Draw a card and discard a card.\n\n[Merlin Bonus] If a fire element card was discarded, choose a unit and put two sheen counters on it. ",
      abilities: [
        {
          id: "THjSE7caau-a1",
          kind: "card-resolution",
          text: "Draw a card and discard a card.",
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
              },
            ],
          },
        },
        {
          id: "THjSE7caau-a2",
          kind: "ability-modifier",
          text: "[Merlin Bonus] If a fire element card was discarded, choose a unit and put two sheen counters on it.",
          modifies: {
            kind: "preceding-non-modifier-ability",
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
          ],
          operation: {
            kind: "append-effect",
            effect: {
              kind: "conditional",
              condition: {
                kind: "history",
                event: "card-discarded",
                window: "this-resolution",
                filter: {
                  kind: "element",
                  oneOf: ["FIRE"],
                },
                minimum: 1,
              },
              then: {
                kind: "choose",
                selection: {
                  id: "chosen-unit",
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
                    player: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                  },
                },
                effect: {
                  kind: "add-counter",
                  subject: {
                    kind: "bound",
                    binding: "chosen-unit",
                  },
                  counter: {
                    named: "sheen",
                  },
                  amount: 2,
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default gleamingSmolder;
