import { grantKeyword, onHit } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/restless-steed.generated.ts";
import { decay, goAgain } from "../shared/keywords.ts";

export const restlessSteed = definePitchFamily(fabPitchFamilies["restless-steed"], {
  keywords: [decay],
  abilities: () => ({
    onHit: onHit(grantKeyword(goAgain)),
  }),
});

export const { red: restlessSteedRed } = restlessSteed.cards;
