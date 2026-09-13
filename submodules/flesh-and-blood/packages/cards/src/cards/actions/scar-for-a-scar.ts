import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/scar-for-a-scar.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const scarForAScar = definePitchFamily(fabPitchFamilies["scar-for-a-scar"], {
  abilities: () => ({
    behindOnLife: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "played-card",
          },
        },
        state: {
          type: "life-comparison",
          player: "self",
          vs: "opponent",
          op: "lt",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const {
  red: scarForAScarRed,
  yellow: scarForAScarYellow,
  blue: scarForAScarBlue,
} = scarForAScar.cards;
