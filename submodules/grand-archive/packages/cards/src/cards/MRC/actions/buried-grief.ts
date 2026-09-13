import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const buriedGrief: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rfnrow8iop",
  slug: "buried-grief",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rfnrow8iop:face:default",
      catalogId: "rfnrow8iop",
      name: "Buried Grief",
      cost: {
        kind: "reserve",
        amount: 3,
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
      rulesText: "Draw two cards, then put a card from your hand on top of your deck.",
      abilities: [
        {
          id: "rfnrow8iop-a1",
          kind: "card-resolution",
          text: "Draw two cards, then put a card from your hand on top of your deck.",
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
                  id: "hand-card",
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
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "hand-card",
                  },
                  from: "hand",
                  destination: {
                    zone: "main-deck",
                    placement: {
                      kind: "top",
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

export default buriedGrief;
