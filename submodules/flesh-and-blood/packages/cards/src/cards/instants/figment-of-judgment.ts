import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/figment-of-judgment.generated.ts";

export const figmentOfJudgment = definePitchFamily(fabPitchFamilies["figment-of-judgment"], {
  keywords: [legendary],
  abilities: () => ({
    whenEntersArenaMayTurnAnyBanishedZoneFace: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "enter-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "turn-face-down",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "any",
              zones: ["banished"],
              count: 1,
            },
          },
        },
      },
    },
  }),
});

export const { yellow: figmentOfJudgmentYellow } = figmentOfJudgment.cards;
