import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/crash-and-bash.generated.ts";

export const crashAndBash = definePitchFamily(fabPitchFamilies["crash-and-bash"], {
  abilities: () => ({
    revealCrush: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "defender" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "reveal",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              filter: { hasKeyword: "crush" },
              count: 1,
            },
          },
          then: { type: "create-token", token: "seismic-surge", controller: "controller" },
        },
      },
    },
  }),
});

export const {
  red: crashAndBashRed,
  yellow: crashAndBashYellow,
  blue: crashAndBashBlue,
} = crashAndBash.cards;
