import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const revitalizingCleanse: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1BkfdFqCrG",
  slug: "revitalizing-cleanse",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1BkfdFqCrG:face:default",
      catalogId: "1BkfdFqCrG",
      name: "Revitalizing Cleanse",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Reveal all cards in your memory. Recover X where X is the amount of water element cards revealed this way. Draw a card. (To recover, remove that many damage counters from your champion.)",
      abilities: [
        {
          id: "1BkfdFqCrG-a1",
          kind: "card-resolution",
          text: "Reveal all cards in your memory. Recover X where X is the amount of water element cards revealed this way. Draw a card. (To recover, remove that many damage counters from your champion.)",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "revealed-memory",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "all",
                  },
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
              },
              {
                kind: "recover",
                player: "controller",
                amount: {
                  kind: "count",
                  collection: {
                    binding: "revealed-memory",
                    filter: {
                      kind: "element",
                      oneOf: ["WATER"],
                    },
                  },
                },
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

export default revitalizingCleanse;
