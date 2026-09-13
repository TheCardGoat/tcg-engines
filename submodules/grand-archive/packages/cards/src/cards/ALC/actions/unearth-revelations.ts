import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const unearthRevelations: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "96yd609g44",
  slug: "unearth-revelations",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "96yd609g44:face:default",
      catalogId: "96yd609g44",
      name: "Unearth Revelations",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Draw two cards, then put two cards from your hand on the bottom of your deck in any order.",
      abilities: [
        {
          id: "96yd609g44-a1",
          kind: "card-resolution",
          text: "Draw two cards, then put two cards from your hand on the bottom of your deck in any order.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 2,
              },
              {
                kind: "choose",
                selection: {
                  id: "hand-cards-to-deck",
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
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "hand-cards-to-deck",
                  },
                  from: "hand",
                  destination: {
                    zone: "main-deck",
                    placement: {
                      kind: "bottom",
                      orderChosenBy: "controller",
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

export default unearthRevelations;
