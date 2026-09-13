import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ghostsOfPendragon: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "SkAe1hsw5H",
  slug: "ghosts-of-pendragon",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "SkAe1hsw5H:face:default",
      catalogId: "SkAe1hsw5H",
      name: "Ghosts of Pendragon",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN", "SPIRIT"],
      },
      elements: ["CRUX"],
      stats: {
        power: 3,
        life: 4,
      },
      rulesText:
        "On Enter: You may return a regalia you control to its owner's material deck. If you do, draw two cards.",
      abilities: [
        {
          id: "SkAe1hsw5H-a1",
          kind: "triggered",
          text: "On Enter: You may return a regalia you control to its owner's material deck. If you do, draw two cards.",
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
                  kind: "choose",
                  selection: {
                    id: "returned-object",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      relationship: "controlled-by",
                      player: "controller",
                      filter: {
                        kind: "supertype",
                        oneOf: ["REGALIA"],
                      },
                    },
                  },
                  effect: {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "returned-object",
                    },
                    destination: {
                      zone: "material-deck",
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

export default ghostsOfPendragon;
