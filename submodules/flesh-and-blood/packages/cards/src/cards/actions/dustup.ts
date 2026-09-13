import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/dustup.generated.ts";
const abilities = {
  onHitCreateTokenAsh: {
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
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "create-token",
            token: "ash",
            controller: "controller",
          },
          {
            type: "transform",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                name: "Ash",
              },
              count: {
                type: "up-to",
                amount: 1,
              },
            },
            into: "aether-ashwing",
          },
        ],
      },
    },
    label: {
      name: "transform",
    },
  },
} as const;
export const dustup = definePitchFamily(fabPitchFamilies["dustup"], {
  abilities: () => ({ ...abilities }),
});
export const { red: dustupRed, yellow: dustupYellow, blue: dustupBlue } = dustup.cards;
