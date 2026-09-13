import { crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/knock-em-off-their-feet.generated.ts";

export const knockEmOffTheirFeet = definePitchFamily(fabPitchFamilies["knock-em-off-their-feet"], {
  abilities: () => ({
    deals4MoreDamageTap: crushAbility({
      effect: {
        type: "tap",
        target: {
          selector: "attack-target",
        },
      },
    }),
  }),
});

export const { red: knockEmOffTheirFeetRed } = knockEmOffTheirFeet.cards;
