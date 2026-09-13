import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const zhangJiaoWayOfPeace: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "el7cwdzin7",
  slug: "zhang-jiao-way-of-peace",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "el7cwdzin7:face:default",
      catalogId: "el7cwdzin7",
      name: "Zhang Jiao, Way of Peace",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "On Enter: Depending on the amount of cards in your memory—\n• 0— Draw two cards.\n• 1 to 3— Recover 4.\n• 4 to 6— Glimpse 4.\n• 7 or more— Each opponent discards a card at random from their memory.",
      abilities: [
        {
          id: "el7cwdzin7-a1",
          kind: "triggered",
          text: "On Enter: Depending on the amount of cards in your memory—\n• 0— Draw two cards.\n• 1 to 3— Recover 4.\n• 4 to 6— Glimpse 4.\n• 7 or more— Each opponent discards a card at random from their memory.",
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
            kind: "branch-on-value",
            value: {
              kind: "count",
              collection: {
                zones: ["memory"],
                player: "controller",
              },
            },
            branches: [
              {
                minimum: 0,
                maximum: 0,
                effect: {
                  kind: "draw",
                  player: "controller",
                  amount: 2,
                },
              },
              {
                minimum: 1,
                maximum: 3,
                effect: {
                  kind: "recover",
                  player: "controller",
                  amount: 4,
                },
              },
              {
                minimum: 4,
                maximum: 6,
                effect: {
                  kind: "keyword-action",
                  action: "glimpse",
                  amount: 4,
                },
              },
              {
                minimum: 7,
                effect: {
                  kind: "discard",
                  player: "each-opponent",
                  selection: {
                    id: "random-discarded-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "each-opponent",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    method: "random",
                    candidates: {
                      kind: "card",
                      zones: ["memory"],
                      relationship: "zone-of",
                      player: "each-opponent",
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

export default zhangJiaoWayOfPeace;
