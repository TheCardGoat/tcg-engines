import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/blessing-of-serenity.generated.ts";

export const blessingOfSerenity = definePitchFamily(fabPitchFamilies["blessing-of-serenity"], {
  parameters: pitchMap({
    red: 3,
    yellow: 2,
    blue: 1,
  }),
  abilities: (amount) => ({
    preventPhysical: {
      type: "prevention",
      preventionKind: "fixed",
      amount,
      damageType: "physical",
      shielded: { selector: "controller" },
      times: 1,
      duration: "this-turn",
    },
  }),
});

export const {
  red: blessingOfSerenityRed,
  yellow: blessingOfSerenityYellow,
  blue: blessingOfSerenityBlue,
} = blessingOfSerenity.cards;
