import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/even-bigger-than-that.generated.ts";
import { opt } from "../shared/keywords.ts";

export const evenBiggerThanThat = definePitchFamily(fabPitchFamilies["even-bigger-than-that"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  keywords: pitchMap({ red: [opt(3)], yellow: [opt(2)], blue: [opt(1)] }),
  abilities: (optCount) => ({
    damagePermission: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "damage-dealt",
        damageType: "physical",
        player: "controller",
        per: "turn",
        comparison: {
          op: "gte",
          value: 1,
        },
      },
      playEffect: {
        role: "condition",
      },
    },
    optRevealAndReward: {
      type: "sequence",
      steps: [
        {
          type: "opt",
          count: optCount,
        },
        {
          type: "reveal",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["deck"],
            position: "top",
            count: 1,
          },
        },
        {
          type: "conditional",
          condition: {
            type: "compare-amount",
            amount: { type: "count", what: "highest-power-revealed-this-turn" },
            comparison: { op: "gt", value: { type: "count", what: "damage-dealt", per: "turn" } },
          },
          then: {
            type: "sequence",
            steps: [
              {
                type: "create-token",
                token: "Quicken",
                controller: "controller",
              },
              {
                type: "draw",
                count: 1,
                player: "controller",
              },
            ],
          },
        },
      ],
    },
  }),
});

export const {
  red: evenBiggerThanThatRed,
  yellow: evenBiggerThanThatYellow,
  blue: evenBiggerThanThatBlue,
} = evenBiggerThanThat.cards;
