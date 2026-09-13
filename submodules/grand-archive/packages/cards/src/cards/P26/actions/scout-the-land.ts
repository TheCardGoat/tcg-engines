import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const scoutTheLand: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "u68a4mwrg3",
  slug: "scout-the-land",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "u68a4mwrg3:face:default",
      catalogId: "u68a4mwrg3",
      name: "Scout the Land",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Look at the top four cards of your deck and put them back in any order. Draw a card.",
      abilities: [
        {
          id: "u68a4mwrg3-a1",
          kind: "card-resolution",
          text: "Look at the top four cards of your deck and put them back in any order. Draw a card.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "sequence",
                effects: [
                  {
                    kind: "look-at",
                    player: "controller",
                    selection: {
                      id: "inspected-top-cards",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 4,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["main-deck"],
                        relationship: "zone-of",
                        player: "controller",
                        fromTop: true,
                      },
                    },
                  },
                  {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "inspected-top-cards",
                    },
                    from: "main-deck",
                    destination: {
                      zone: "main-deck",
                      placement: {
                        kind: "top",
                        orderChosenBy: "controller",
                      },
                    },
                  },
                ],
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default scoutTheLand;
