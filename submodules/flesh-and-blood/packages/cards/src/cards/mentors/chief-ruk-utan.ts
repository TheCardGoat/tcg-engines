import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/mentors/chief-ruk-utan.generated.ts";

export const chiefRukUtan = defineCard(fabCardIdentitiesByCanonicalId.LrjhhdFHqndpWG8d66GJz, {
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
      label: {
        name: "intimidate",
      },
    },
    teachIntimidation: {
      kind: "static",
      staticKind: "triggered",
      functionalZones: ["arsenal"],
      trigger: {
        kind: "event-and-state",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "played-card",
            relationship: {
              kind: "any",
            },
            filter: {
              power: { op: "gte", value: 6 },
            },
            bindAs: "it",
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
                  type: "intimidate",
                  target: "opponent",
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
                  value: 2,
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
                      name: "Alpha Rampage",
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
      label: {
        name: "intimidate",
      },
    },
  },
});
