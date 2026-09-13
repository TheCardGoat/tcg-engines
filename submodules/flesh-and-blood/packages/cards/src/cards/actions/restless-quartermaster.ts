import { onHit } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/restless-quartermaster.generated.ts";
import { decay } from "../shared/keywords.ts";

export const restlessQuartermaster = definePitchFamily(fabPitchFamilies["restless-quartermaster"], {
  keywords: [decay],
  abilities: () => ({
    arsenal: onHit({
      type: "banish",
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "attack-target",
        zones: ["arsenal"],
        count: 1,
      },
    }),
  }),
});
export const { red: restlessQuartermasterRed } = restlessQuartermaster.cards;
