import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const studyTheFables: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0ye3aebjvw",
  slug: "study-the-fables",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0ye3aebjvw:face:default",
      catalogId: "0ye3aebjvw",
      name: "Study the Fables",
      cost: {
        kind: "reserve",
        amount: 2,
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
        "Target player reveals six cards from their material deck. Draw a card into your memory.",
      abilities: [
        {
          id: "0ye3aebjvw-a1",
          kind: "card-resolution",
          text: "Target player reveals six cards from their material deck. Draw a card into your memory.",
          targets: [
            {
              id: "target-player",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["controller", "opponent", "another-player"],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: {
                  binding: "target-player",
                },
                selection: {
                  id: "revealed-material-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: {
                    binding: "target-player",
                  },
                  count: {
                    kind: "exactly",
                    amount: 6,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    zones: ["material-deck"],
                    relationship: "zone-of",
                    player: {
                      binding: "target-player",
                    },
                  },
                },
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
            ],
          },
        },
      ],
    },
  },
};

export default studyTheFables;
