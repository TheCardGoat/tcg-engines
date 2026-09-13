import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/lead-the-charge.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const leadTheCharge = definePitchFamily(fabPitchFamilies["lead-the-charge"], {
  parameters: {
    red: { threshold: 0 },
    yellow: { threshold: 1 },
    blue: { threshold: 2 },
  },
  keywords: [goAgain],
  abilities: ({ threshold }) => ({
    gainActionPointOnNextAction: {
      type: "delayed-trigger",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: { kind: "player", player: "ability-controller" },
          observes: {
            kind: "event-object",
            selector: "played-card",
            relationship: { kind: "controller", player: "ability-controller" },
            filter: {
              typeBox: { types: ["Action"] },
              cost: { op: "gte", value: threshold },
            },
            bindAs: "it",
          },
        },
      },
      policy: { kind: "windowed", duration: "this-turn", matching: "first" },
      resolution: {
        kind: "effect",
        effect: { type: "gain-action-points", amount: 1 },
      },
    },
  }),
});

export const {
  red: leadTheChargeRed,
  yellow: leadTheChargeYellow,
  blue: leadTheChargeBlue,
} = leadTheCharge.cards;
