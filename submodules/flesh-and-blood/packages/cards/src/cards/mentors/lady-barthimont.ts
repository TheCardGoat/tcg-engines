import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/mentors/lady-barthimont.generated.ts";
import { dominate } from "../shared/keywords.ts";

export const ladyBarthimont = defineCard(fabCardIdentitiesByCanonicalId.rpqF9GbWN7Kkb6hPKPnJk, {
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
    teachShadowBrute: {
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
            filter: attackActionFilter(),
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
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  power: {
                    op: "gte",
                    value: 6,
                  },
                },
              },
              then: {
                type: "sequence",
                steps: [
                  {
                    type: "grant-property",
                    property: {
                      kind: "keyword",
                      keyword: dominate,
                    },
                    target: {
                      selector: "this-attack",
                    },
                    duration: "this-turn",
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
