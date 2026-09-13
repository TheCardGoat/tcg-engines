import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/restless-shieldmaiden.generated.ts";
import { decay, shadowResist } from "../shared/keywords.ts";

export const restlessShieldmaiden = definePitchFamily(fabPitchFamilies["restless-shieldmaiden"], {
  keywords: [shadowResist(1), decay],
});

export const { red: restlessShieldmaidenRed } = restlessShieldmaiden.cards;
