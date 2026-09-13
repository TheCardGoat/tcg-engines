import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const babyGraySlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0hsncz1fz2",
  slug: "baby-gray-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0hsncz1fz2:face:default",
      catalogId: "0hsncz1fz2",
      name: "Baby Gray Slime",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "SLIME"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "Intercept\n\nOn Enter: You may reveal two Slime cards from your hand and/or memory. If you do, draw a card.",
      abilities: [
        {
          id: "0hsncz1fz2-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept",
          keyword: {
            name: "intercept",
          },
        },
        {
          id: "0hsncz1fz2-a2",
          kind: "triggered",
          text: "On Enter: You may reveal two Slime cards from your hand and/or memory. If you do, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
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
                      amount: 2,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["hand"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "subtype",
                        oneOf: ["SLIME"],
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
        },
      ],
    },
  },
};

export default babyGraySlime;
