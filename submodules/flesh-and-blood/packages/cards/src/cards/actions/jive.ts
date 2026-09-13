import { createToken } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/jive.generated.ts";

export const jive = definePitchFamily(fabPitchFamilies.jive, {
  abilities: () => ({ createBladeDance: createToken("blade-dance") }),
});

export const { blue: jiveBlue } = jive.cards;
