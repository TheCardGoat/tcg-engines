import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const franCarmineSpark: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "WRu4cuRHOS",
  slug: "fran-carmine-spark",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "WRu4cuRHOS:face:default",
      catalogId: "WRu4cuRHOS",
      name: "Fran, Carmine Spark",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Attack: Target player banishes a card from their graveyard. If a fire element card was banished this way, you empower 3.",
      abilities: [
        {
          id: "WRu4cuRHOS-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: Target player banishes a card from their graveyard. If a fire element card was banished this way, you empower 3.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-player",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["controller", "opponent", "another-player"],
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
                kind: "banish",
                player: {
                  binding: "target-player",
                },
                selection: {
                  id: "banished-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: {
                    binding: "target-player",
                  },
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["graveyard"],
                    relationship: "zone-of",
                    player: {
                      binding: "target-player",
                    },
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "banished-cards",
                  },
                  filter: {
                    kind: "element",
                    oneOf: ["FIRE"],
                  },
                },
                then: {
                  kind: "keyword-action",
                  action: "empower",
                  amount: 3,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default franCarmineSpark;
