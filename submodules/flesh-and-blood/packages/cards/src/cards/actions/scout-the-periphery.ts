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
            // Printed "target hero's deck": the hero is declared on the stack
            // (CR 1.8.5); the deck top is a non-target subject scoped to that
            // hero, so the chooser never sees the other deck's top.
            playerTarget: { selector: "any-hero" },
            playerTargetBinding: "scout-target-hero",
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
