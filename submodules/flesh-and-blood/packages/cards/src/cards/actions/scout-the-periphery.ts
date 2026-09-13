import { nextAttackActionLatch, plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/scout-the-periphery.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const scoutThePeriphery = definePitchFamily(fabPitchFamilies["scout-the-periphery"], {
  parameters: pitchMap({
    red: { powerBonus: 3 },
    yellow: { powerBonus: 2 },
    blue: { powerBonus: 1 },
  }),
  keywords: [goAgain],
  abilities: ({ powerBonus }) => ({
    lookAndEmpowerFromArsenal: {
      type: "sequence",
      steps: [
        {
          type: "look",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "any",
            zones: ["deck"],
            position: "top",
            count: 1,
          },
          outputBinding: "it",
        },
        plusPower(powerBonus, {
          appliesTo: nextAttackActionLatch({ playedFromZones: ["arsenal"] }),
        }),
      ],
    },
  }),
});

export const {
  red: scoutThePeripheryRed,
  yellow: scoutThePeripheryYellow,
  blue: scoutThePeripheryBlue,
} = scoutThePeriphery.cards;
