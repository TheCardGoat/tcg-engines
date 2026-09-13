import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/bone-puppetry.generated.ts";

export const bonePuppetry = defineCard(fabCardIdentitiesByCanonicalId["wzmJ9hckLQFhDgbbJntzz"], {
  keywords: [bladeBreak],
  abilities: {
    whenDefendsMayReturnAllyFromGraveyardArenaIf: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                typeBox: {
                  subtypes: ["Ally"],
                },
              },
              count: 1,
            },
            to: {
              zone: "permanent",
            },
            outputBinding: "it",
          },
          then: {
            type: "delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "end-phase",
                actor: {
                  kind: "any",
                },
                observes: {
                  kind: "none",
                },
              },
            },
            policy: {
              kind: "windowed",
              duration: "this-turn",
              matching: "first",
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "sequence",
                steps: [
                  {
                    type: "destroy",
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                  },
                  {
                    type: "discard",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "controller",
                      zones: ["hand"],
                      count: {
                        type: "all",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
});
