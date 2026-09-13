import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/battle-prep.generated.ts";
import { goAgain, opt } from "../shared/keywords.ts";

export const battlePrep = definePitchFamily(fabPitchFamilies["battle-prep"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  keywords: [opt(2), goAgain],
  abilities: (amount) => ({
    arsenalBonus: {
      kind: "resolution",
      condition: {
        type: "played-this",
        per: "turn",
        onlySource: true,
        filter: { playedFromZones: ["arsenal"] },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount,
        target: { selector: "this-attack" },
        duration: "this-turn",
        appliesTo: nextAttackActionLatch(),
      },
    },
  }),
});

export const {
  red: battlePrepRed,
  yellow: battlePrepYellow,
  blue: battlePrepBlue,
} = battlePrep.cards;
