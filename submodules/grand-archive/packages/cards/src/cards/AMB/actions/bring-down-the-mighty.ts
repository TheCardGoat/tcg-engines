import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bringDownTheMighty: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ybds1rkgnp",
  slug: "bring-down-the-mighty",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ybds1rkgnp:face:default",
      catalogId: "ybds1rkgnp",
      name: "Bring Down the Mighty",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Until the beginning of your next turn, target ally can't attack. If that ally is unique, draw a card into your memory.",
      abilities: [
        {
          id: "ybds1rkgnp-a1",
          kind: "card-resolution",
          text: "Until the beginning of your next turn, target ally can't attack. If that ally is unique, draw a card into your memory.",
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
                kind: "rule-modification",
                mode: "forbid",
                action: "attack",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                duration: {
                  kind: "until-start-of-turn",
                  whose: "controller",
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

export default bringDownTheMighty;
