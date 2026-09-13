import { comboResolution } from "@tcg/flesh-and-blood-types";

import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blackout-kick.generated.ts";

import { combo } from "../shared/keywords.ts";

const abilities = {
  comboPowerBonus: comboResolution({
    names: ["Rising Knee Thrust"],
    effect: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount: 3,
      target: {
        selector: "self",
      },
      duration: "this-turn",
    },
  }),
} as const;

export const blackoutKick = definePitchFamily(fabPitchFamilies["blackout-kick"], {
  keywords: [combo],
  abilities: () => ({ ...abilities }),
});

export const {
  red: blackoutKickRed,
  yellow: blackoutKickYellow,
  blue: blackoutKickBlue,
} = blackoutKick.cards;
