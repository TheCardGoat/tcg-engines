import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/battlefront-bastion.generated.ts";

export const battlefrontBastion = definePitchFamily(fabPitchFamilies["battlefront-bastion"], {
  abilities: () => ({
    defendAlone: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "defender" },
          cohort: { kind: "alone" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "prevention",
          preventionKind: "fixed",
          amount: 1,
          shielded: { selector: "controller" },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const {
  red: battlefrontBastionRed,
  yellow: battlefrontBastionYellow,
  blue: battlefrontBastionBlue,
} = battlefrontBastion.cards;
