import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const portlyRaccoon: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9ZapXmmBc9",
  slug: "portly-raccoon",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9ZapXmmBc9:face:default",
      catalogId: "9ZapXmmBc9",
      name: "Portly Raccoon",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "RACCOON"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "On Enter: You may reveal two Raccoon cards from your hand and/or memory. When you do, target opponent banishes a card from their graveyard.",
      abilities: [
        {
          id: "9ZapXmmBc9-a1",
          kind: "triggered",
          text: "On Enter: You may reveal two Raccoon cards from your hand and/or memory. When you do, target opponent banishes a card from their graveyard.",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "reflexive",
              action: {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "reveal-selection",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 2,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["hand"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "subtype",
                      oneOf: ["RACCOON"],
                    },
                  },
                },
              },
              consequence: {
                kind: "banish",
                player: {
                  binding: "target-opponent",
                },
                selection: {
                  id: "banished-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: {
                    binding: "target-opponent",
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
                      binding: "target-opponent",
                    },
                  },
                },
              },
              targets: [
                {
                  id: "target-opponent",
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
                    players: ["opponent"],
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

export default portlyRaccoon;
