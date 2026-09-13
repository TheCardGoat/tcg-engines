import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/meganetic-lockwave.generated.ts";

export const meganeticLockwave = definePitchFamily(fabPitchFamilies["meganetic-lockwave"], {
  keywords: [goAgain],
  abilities: () => ({
    targetChoosesXEquipmentThenChoose1AmongMustDefendAttacksTurnEquipmentAble: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "choose-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "attack-target",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  types: ["Equipment"],
                },
              },
              count: {
                type: "x",
              },
            },
            chooser: "attack-target",
            outputBinding: "them",
          },
          {
            type: "choose-card",
            target: {
              selector: "binding",
              binding: "them",
            },
            outputBinding: "it",
          },
          {
            type: "rule-modification",
            mode: "require",
            action: "defend",
            filter: {
              typeBox: {
                types: ["Equipment"],
              },
            },
            duration: "this-turn",
          },
        ],
      },
    },
  }),
});

export const { blue: meganeticLockwaveBlue } = meganeticLockwave.cards;
