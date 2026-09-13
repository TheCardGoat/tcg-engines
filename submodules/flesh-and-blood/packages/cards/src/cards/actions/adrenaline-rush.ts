import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/adrenaline-rush.generated.ts";

export const adrenalineRush = definePitchFamily(fabPitchFamilies["adrenaline-rush"], {
  abilities: () => ({
    behindOnLife: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "play",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "none" },
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
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 3,
          target: { selector: "self" },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const {
  red: adrenalineRushRed,
  yellow: adrenalineRushYellow,
  blue: adrenalineRushBlue,
} = adrenalineRush.cards;
