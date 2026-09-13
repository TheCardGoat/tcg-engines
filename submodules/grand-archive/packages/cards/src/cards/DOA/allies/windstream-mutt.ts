import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const windstreamMutt: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1o0tKizBZ6",
  slug: "windstream-mutt",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1o0tKizBZ6:face:default",
      catalogId: "1o0tKizBZ6",
      name: "Windstream Mutt",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "DOG"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Enter: Reveal a card at random from your memory. If that card is wind element, choose another ally you control and put a buff counter on it. (Allies get +1 power and +1 life for each buff counter on them. Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "1o0tKizBZ6-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Reveal a card at random from your memory. If that card is wind element, choose another ally you control and put a buff counter on it. (Allies get +1 power and +1 life for each buff counter on them. Apply this effect only if your champion's class matches this card's class.)",
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
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "reveal-selection",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                  method: "random",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "reveal-selection",
                  },
                  filter: {
                    kind: "element",
                    oneOf: ["WIND"],
                  },
                },
                then: {
                  kind: "choose",
                  selection: {
                    id: "chosen-object",
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
                      relationship: "controlled-by",
                      player: "controller",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ALLY"],
                          },
                          {
                            kind: "not-source",
                          },
                        ],
                      },
                    },
                  },
                  effect: {
                    kind: "add-counter",
                    subject: {
                      kind: "bound",
                      binding: "chosen-object",
                    },
                    counter: "buff",
                    amount: 1,
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

export default windstreamMutt;
