import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const creativeTinder: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "KCXN59ldAi",
  slug: "creative-tinder",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "KCXN59ldAi:face:default",
      catalogId: "KCXN59ldAi",
      name: "Creative Tinder",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText: "Draw two cards, then discard a card.",
      abilities: [
        {
          id: "KCXN59ldAi-a1",
          kind: "card-resolution",
          text: "Draw two cards, then discard a card.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 2,
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
                bindResultAs: "discarded-card",
              },
            ],
          },
        },
      ],
    },
  },
};

export default creativeTinder;
