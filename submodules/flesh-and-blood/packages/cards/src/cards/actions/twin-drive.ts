import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/twin-drive.generated.ts";
import { boost } from "../shared/keywords.ts";

/** Model notes (hand-authored): printed text is Boost twice. */
export const twinDrive = definePitchFamily(fabPitchFamilies["twin-drive"], {
  keywords: [boost, boost],
});

export const { red: twinDriveRed } = twinDrive.cards;
