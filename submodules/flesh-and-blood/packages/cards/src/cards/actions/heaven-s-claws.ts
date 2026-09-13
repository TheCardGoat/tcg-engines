import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/heaven-s-claws.generated.ts";

const abilities = {} as const;

export const heavenSClaws = definePitchFamily(fabPitchFamilies["heaven-s-claws"], {
  abilities: () => ({ ...abilities }),
});

export const {
  red: heavenSClawsRed,
  yellow: heavenSClawsYellow,
  blue: heavenSClawsBlue,
} = heavenSClaws.cards;
