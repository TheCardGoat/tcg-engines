import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spears-of-surreality.generated.ts";
import { goAgain, phantasm } from "../shared/keywords.ts";

const abilities = {} as const;

export const spearsOfSurreality = definePitchFamily(fabPitchFamilies["spears-of-surreality"], {
  keywords: [phantasm, goAgain],
  abilities: () => abilities,
});

export const {
  red: spearsOfSurrealityRed,
  yellow: spearsOfSurrealityYellow,
  blue: spearsOfSurrealityBlue,
} = spearsOfSurreality.cards;
