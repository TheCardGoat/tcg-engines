import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/smash-with-big-tree.generated.ts";

export const smashWithBigTree = definePitchFamily(fabPitchFamilies["smash-with-big-tree"], {});

export const {
  red: smashWithBigTreeRed,
  yellow: smashWithBigTreeYellow,
  blue: smashWithBigTreeBlue,
} = smashWithBigTree.cards;
