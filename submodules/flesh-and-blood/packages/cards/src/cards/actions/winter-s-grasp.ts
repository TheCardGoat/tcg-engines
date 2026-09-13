import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/winter-s-grasp.generated.ts";

export const winterSGrasp = definePitchFamily(fabPitchFamilies["winter-s-grasp"], {});

export const {
  red: winterSGraspRed,
  yellow: winterSGraspYellow,
  blue: winterSGraspBlue,
} = winterSGrasp.cards;
