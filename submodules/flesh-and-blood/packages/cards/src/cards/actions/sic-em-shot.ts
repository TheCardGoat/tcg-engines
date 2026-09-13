import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sic-em-shot.generated.ts";
import { goAgain } from "../shared/keywords.ts";

const abilities = {} as const;

export const sicEmShot = definePitchFamily(fabPitchFamilies["sic-em-shot"], {
  keywords: [goAgain],
  abilities: () => abilities,
});

export const { red: sicEmShotRed, yellow: sicEmShotYellow, blue: sicEmShotBlue } = sicEmShot.cards;
