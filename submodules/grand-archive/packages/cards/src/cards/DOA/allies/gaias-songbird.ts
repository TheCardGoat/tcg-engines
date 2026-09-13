import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gaiasSongbird: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "sHzSmygjWY",
  slug: "gaias-songbird",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "sHzSmygjWY:face:default",
      catalogId: "sHzSmygjWY",
      name: "Gaia's Songbird",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "BIRD"],
      },
      elements: ["TERA"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Enter: Reveal cards from the top of your deck until you reveal a Beast ally card. Put that card into your hand and the rest on the bottom of your deck in a random order. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "sHzSmygjWY-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Reveal cards from the top of your deck until you reveal a Beast ally card. Put that card into your hand and the rest on the bottom of your deck in a random order. (Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
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
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal-until",
                player: "controller",
                zone: "main-deck",
                stopWhen: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["BEAST"],
                    },
                  ],
                },
                bindMatchAs: "revealed-match",
                bindRemainderAs: "revealed-remainder",
              },
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "revealed-match",
                },
                from: "main-deck",
                destination: {
                  zone: "hand",
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "revealed-remainder",
                },
                from: "main-deck",
                destination: {
                  zone: "main-deck",
                  placement: {
                    kind: "bottom",
                    order: {
                      kind: "random",
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default gaiasSongbird;
