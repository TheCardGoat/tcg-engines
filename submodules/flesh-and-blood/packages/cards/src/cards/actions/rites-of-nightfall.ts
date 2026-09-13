import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rites-of-nightfall.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const ritesOfNightfall = definePitchFamily(fabPitchFamilies["rites-of-nightfall"], {
  keywords: [goAgain],
  abilities: () => ({
    gate: { type: "create-token", token: "gate-to-i-arathael", controller: "controller" },
  }),
});

export const { blue: ritesOfNightfallBlue } = ritesOfNightfall.cards;
