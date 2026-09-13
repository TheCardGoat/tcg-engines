import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/mentors/lord-sutcliffe.generated.ts";

export const lordSutcliffe = defineCard(fabCardIdentitiesByCanonicalId.WprpWWNjq6F8BwRrTPFmM, {
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
    teachRuneblade: {
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
              typeBox: {
                types: ["Action"],
                excludeSubtypes: ["Attack"],
              },
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
                  type: "deal-damage",
                  damageType: "arcane",
                  amount: 1,
                  target: {
                    selector: "each-hero",
                  },
                },
                {
                  type: "add-counter",
                  counter: {
                    kind: "named",
                    name: "lesson",
                  },
                  count: {
                    type: "count",
                    what: "damage-dealt",
                    per: "chain-link",
                  },
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
                      moniker: "Specialization",
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
    },
  },
});
