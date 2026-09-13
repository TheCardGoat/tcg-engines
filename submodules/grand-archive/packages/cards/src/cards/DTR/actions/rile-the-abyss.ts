import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rileTheAbyss: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ye7f7o5yut",
  slug: "rile-the-abyss",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ye7f7o5yut:face:default",
      catalogId: "ye7f7o5yut",
      name: "Rile the Abyss",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Draw a card. Then discard up to two Specter cards. For each card discarded this way, draw an additional card.",
      abilities: [
        {
          id: "ye7f7o5yut-a1",
          kind: "card-resolution",
          text: "Draw a card. Then discard up to two Specter cards. For each card discarded this way, draw an additional card.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "sequence",
                effects: [
                  {
                    kind: "discard",
                    player: "controller",
                    selection: {
                      id: "discarded-card",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "up-to",
                        amount: 2,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["hand"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "subtype",
                          oneOf: ["SPECTER"],
                        },
                      },
                    },
                  },
                  {
                    kind: "for-each",
                    collection: {
                      binding: "discarded-card",
                    },
                    bindEachAs: "that-card",
                    effect: {
                      kind: "draw",
                      player: "controller",
                      amount: 1,
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  },
};

export default rileTheAbyss;
