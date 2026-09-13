import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/gesture-of-goodwill.generated.ts";
import { protect } from "../shared/keywords.ts";

export const gestureOfGoodwill = definePitchFamily(fabPitchFamilies["gesture-of-goodwill"], {
  keywords: [protect],
  abilities: () => ({
    protected: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "protect",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "none" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          chooser: "another-hero",
          effect: {
            type: "give",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "another-hero",
              zones: ["permanent"],
              filter: { typeBox: { metatypes: ["Token"] } },
              count: 1,
            },
            controller: "controller",
          },
        },
      },
    },
  }),
});

export const { blue: gestureOfGoodwillBlue } = gestureOfGoodwill.cards;
