import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/snag.generated.ts";

export const snag = definePitchFamily(fabPitchFamilies["snag"], {
  abilities: () => ({
    attackActionCanTGainFromTheirOwnEffects: {
      kind: "resolution",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "gain-power",
        subject: attackActionFilter(),
        source: "self-or-attack-reaction-effects",
        duration: "this-turn",
      },
    },
  }),
});

export const { blue: snagBlue } = snag.cards;
