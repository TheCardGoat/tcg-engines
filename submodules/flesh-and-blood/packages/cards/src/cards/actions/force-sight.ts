import { nextAttackAction, plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/force-sight.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const forceSight = definePitchFamily(fabPitchFamilies["force-sight"], {
  parameters: pitchMap({
    red: { powerBonus: 3 },
    yellow: { powerBonus: 2 },
    blue: { powerBonus: 1 },
  }),
  keywords: [goAgain],
  abilities: ({ powerBonus }) => ({
    empowerNextAttack: nextAttackAction({ grant: plusPower(powerBonus) }),
    optFromArsenal: {
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
      resolution: { kind: "effect", effect: { type: "opt", count: 2 } },
    },
  }),
});

export const {
  red: forceSightRed,
  yellow: forceSightYellow,
  blue: forceSightBlue,
} = forceSight.cards;
