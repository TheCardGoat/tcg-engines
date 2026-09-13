import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/frontline-scout.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const frontlineScout = definePitchFamily(fabPitchFamilies["frontline-scout"], {
  abilities: () => ({
    lookAtHand: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "look",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "defending-hero",
            zones: ["hand"],
            count: { type: "all" },
          },
        },
      },
    },
    arsenalGoAgain: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "played-card" },
          from: ["arsenal"],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "grant-property",
          property: { kind: "keyword", keyword: goAgain },
          target: { selector: "self" },
          duration: "permanent",
        },
      },
    },
  }),
});

export const {
  red: frontlineScoutRed,
  yellow: frontlineScoutYellow,
  blue: frontlineScoutBlue,
} = frontlineScout.cards;
