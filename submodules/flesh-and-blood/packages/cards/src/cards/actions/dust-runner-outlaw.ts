import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/dust-runner-outlaw.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const dustRunnerOutlaw = definePitchFamily(fabPitchFamilies["dust-runner-outlaw"], {
  keywords: [goAgain],
});

export const {
  red: dustRunnerOutlawRed,
  yellow: dustRunnerOutlawYellow,
  blue: dustRunnerOutlawBlue,
} = dustRunnerOutlaw.cards;
