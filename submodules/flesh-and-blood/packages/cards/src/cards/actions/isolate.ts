import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/isolate.generated.ts";
import { stealth } from "../shared/keywords.ts";
import { dominate } from "../shared/keywords.ts";

const abilities = {} as const;

export const isolate = definePitchFamily(fabPitchFamilies["isolate"], {
  keywords: [stealth, dominate],
  abilities: () => ({ ...abilities }),
});

export const { red: isolateRed, yellow: isolateYellow, blue: isolateBlue } = isolate.cards;
