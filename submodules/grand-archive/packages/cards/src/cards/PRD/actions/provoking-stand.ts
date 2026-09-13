import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const provokingStand: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0ij18cl001",
  slug: "provoking-stand",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0ij18cl001:face:default",
      catalogId: "0ij18cl001",
      name: "Provoking Stand",
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
      speed: "slow",
      stats: {},
      rulesText:
        "Target ally gains taunt until the beginning of your next turn. If that ally is unique, draw a card into your memory.",
      abilities: [
        {
          id: "0ij18cl001-a1",
          kind: "card-resolution",
          text: "Target ally gains taunt until the beginning of your next turn. If that ally is unique, draw a card into your memory.",
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
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-1",
                },
                affectedSet: "locked",
                duration: {
                  kind: "until-start-of-turn",
                  whose: "controller",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-keyword",
                  keyword: {
                    name: "taunt",
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  filter: {
                    kind: "supertype",
                    oneOf: ["UNIQUE"],
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default provokingStand;
