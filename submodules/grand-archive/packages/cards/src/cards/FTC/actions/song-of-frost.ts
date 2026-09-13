import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const songOfFrost: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "t1cn1tzgcx",
  slug: "song-of-frost",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "t1cn1tzgcx:face:default",
      catalogId: "t1cn1tzgcx",
      name: "Song of Frost",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL", "MELODY"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] You may banish a card with floating memory from your graveyard rather than pay this card's reserve cost.\n\nIf a unit is attacking, end the combat phase. (As a phase ends, banish all triggers, activations, and materializations on the effects stack.)",
      abilities: [
        {
          id: "t1cn1tzgcx-a1",
          kind: "card-resolution",
          text: "[Class Bonus] You may banish a card with floating memory from your graveyard rather than pay this card's reserve cost.",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "banish",
              player: "controller",
              selection: {
                id: "banished-cards",
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
                  filter: {
                    kind: "has-keyword",
                    keyword: "floating-memory",
                  },
                },
              },
            },
          },
        },
        {
          id: "t1cn1tzgcx-a2",
          kind: "card-resolution",
          text: "If a unit is attacking, end the combat phase. (As a phase ends, banish all triggers, activations, and materializations on the effects stack.)",
          effect: {
            kind: "conditional",
            condition: {
              kind: "collection-exists",
              collection: {
                zones: ["field", "intent"],
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "object-state",
                      state: "attacking",
                    },
                  ],
                },
              },
            },
            then: {
              kind: "end-phase",
              phase: "combat",
            },
          },
        },
      ],
    },
  },
};

export default songOfFrost;
