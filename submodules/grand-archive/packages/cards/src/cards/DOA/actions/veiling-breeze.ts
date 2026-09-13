import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const veilingBreeze: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "KoF3AMSlUe",
  slug: "veiling-breeze",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "KoF3AMSlUe:face:default",
      catalogId: "KoF3AMSlUe",
      name: "Veiling Breeze",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL", "REACTION"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Reveal any amount of wind element cards from your memory. Until end of turn, if damage would be dealt to your champion, prevent an amount of that damage equal to the amount of cards revealed this way.",
      abilities: [
        {
          id: "KoF3AMSlUe-a1",
          kind: "card-resolution",
          text: "Reveal any amount of wind element cards from your memory. Until end of turn, if damage would be dealt to your champion, prevent an amount of that damage equal to the amount of cards revealed this way.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  binding: "revealed-wind-cards",
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "revealed-wind-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "any-number",
                  },
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "element",
                      oneOf: ["WIND"],
                    },
                  },
                },
              },
              {
                kind: "replacement",
                event: {
                  name: "damage-dealt",
                  recipient: {
                    kind: "event-object",
                    controller: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                  },
                },
                operation: {
                  kind: "prevent",
                  amount: {
                    kind: "count",
                    collection: {
                      binding: "revealed-wind-cards",
                    },
                  },
                },
                duration: {
                  kind: "this-turn",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default veilingBreeze;
