import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/endless-winter.generated.ts";

export const endlessWinter = definePitchFamily(fabPitchFamilies["endless-winter"], {
  keywords: [
    {
      name: "specialization",
      hero: "Oldhim",
    },
    fusion("Ice"),
  ],
  abilities: () => ({
    ifEndlessWinterWasFusedWheneverDefendingHeroAdds: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "fused",
      },
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "defend",
            actor: {
              kind: "player",
              player: "opponent",
            },
            observes: {
              kind: "event-object",
              selector: "defender",
              relationship: {
                kind: "any",
              },
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-chain-link",
          matching: "every",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "create-token",
            token: "frostbite",
            controller: "defending-hero",
          },
        },
      },
    },
    ifEndlessWinterHitsHeroUntilEndTheirNext: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "activate",
              actor: {
                kind: "player",
                player: "opponent",
              },
              observes: {
                kind: "none",
              },
            },
          },
          policy: {
            kind: "windowed",
            duration: "until-end-of-their-next-turn",
            matching: "every",
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "create-token",
              token: "frostbite",
              controller: "opponent",
            },
          },
        },
      },
    },
  }),
});
export const { red: endlessWinterRed } = endlessWinter.cards;
