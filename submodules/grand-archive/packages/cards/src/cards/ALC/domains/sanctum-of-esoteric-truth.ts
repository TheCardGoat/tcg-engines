import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sanctumOfEsotericTruth: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "k45swaf8ur",
  slug: "sanctum-of-esoteric-truth",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "k45swaf8ur:face:default",
      catalogId: "k45swaf8ur",
      name: "Sanctum of Esoteric Truth",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["DOMAIN"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "THRONE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Whenever your champion levels up, you may put two cards from your hand and/or memory on the bottom of your deck. If you do, draw two cards.",
      abilities: [
        {
          id: "k45swaf8ur-a1",
          kind: "triggered",
          text: "Whenever your champion levels up, you may put two cards from your hand and/or memory on the bottom of your deck. If you do, draw two cards.",
          trigger: {
            kind: "event",
            event: {
              name: "champion-leveled-up",
              actor: "controller",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
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
                  kind: "choose",
                  selection: {
                    id: "hand-or-memory-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 2,
                    },
                    unique: true,
                    candidates: {
                      kind: "card",
                      zones: ["hand", "memory"],
                      relationship: "zone-of",
                      player: "controller",
                    },
                  },
                  effect: {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "hand-or-memory-cards",
                    },
                    destination: {
                      zone: "main-deck",
                      placement: {
                        kind: "bottom",
                        orderChosenBy: "controller",
                      },
                    },
                  },
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: 2,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default sanctumOfEsotericTruth;
