import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/mentors/the-librarian.generated.ts";

export const theLibrarian = defineCard(fabCardIdentitiesByCanonicalId.QcgncKTnLcdGKQnwDjqdz, {
  abilities: {
    revealAtStart: {
      kind: "static",
      staticKind: "triggered",
      functionalZones: ["arsenal"],
      trigger: {
        kind: "event-and-state",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "has-status",
          status: "face-down-in-arsenal",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "turn-face-up",
            target: {
              selector: "self",
            },
          },
        },
      },
    },
    teachSpectralShield: {
      kind: "static",
      staticKind: "triggered",
      functionalZones: ["arsenal"],
      trigger: {
        kind: "event-and-state",
        event: {
          name: "create",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "created-object",
            relationship: {
              kind: "any",
            },
            filter: {
              name: "Spectral Shield",
              typeBox: {
                metatypes: ["Token"],
              },
            },
          },
        },
        state: {
          type: "has-status",
          status: "face-up-in-arsenal",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "sequence",
              steps: [
                {
                  type: "draw",
                  count: 1,
                  player: "controller",
                },
                {
                  type: "add-counter",
                  counter: {
                    kind: "named",
                    name: "lesson",
                  },
                  count: 1,
                  target: {
                    selector: "self",
                  },
                },
              ],
            },
            {
              type: "conditional",
              condition: {
                type: "has-counter",
                counter: {
                  kind: "named",
                  name: "lesson",
                },
                target: {
                  selector: "self",
                },
                comparison: {
                  op: "gte",
                  value: 3,
                },
              },
              then: {
                type: "sequence",
                steps: [
                  {
                    type: "banish",
                    target: {
                      selector: "self",
                    },
                  },
                  {
                    type: "search",
                    zones: ["deck"],
                    filter: {
                      hasKeyword: "specialization",
                    },
                    mayFail: true,
                    to: {
                      zone: "arsenal",
                      visibility: "face-up",
                    },
                  },
                  {
                    type: "shuffle",
                    zone: "deck",
                  },
                ],
              },
            },
          ],
        },
      },
      limit: {
        count: 1,
        per: "turn",
      },
    },
  },
});
