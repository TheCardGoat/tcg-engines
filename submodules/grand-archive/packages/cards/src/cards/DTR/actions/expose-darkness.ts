import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const exposeDarkness: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "991ovfr8o0",
  slug: "expose-darkness",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "991ovfr8o0:face:default",
      catalogId: "991ovfr8o0",
      name: "Expose Darkness",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "If target unit has stealth, draw a card. Then that unit loses stealth until end of turn.",
      abilities: [
        {
          id: "991ovfr8o0-a1",
          kind: "card-resolution",
          text: "If target unit has stealth, draw a card. Then that unit loses stealth until end of turn.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  filter: {
                    kind: "has-keyword",
                    keyword: "stealth",
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-1",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "remove-keyword",
                  keyword: {
                    name: "stealth",
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

export default exposeDarkness;
