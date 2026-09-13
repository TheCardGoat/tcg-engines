import { createToken } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/goremass-summoning.generated.ts";

export const goremassSummoning = definePitchFamily(fabPitchFamilies["goremass-summoning"], {
  keywords: [goAgain],

  abilities: () => ({
    createBlasmophetAfterBanishingSixPowerCard: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "banish-power-6", player: "controller" },
      effect: createToken("blasmophet-the-insatiable-hunger"),
    },
  }),
});

export const { blue: goremassSummoningBlue } = goremassSummoning.cards;
