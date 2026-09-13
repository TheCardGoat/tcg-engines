import { grantKeyword } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rumbling-of-i-arathael.generated.ts";
import { overpower } from "../shared/keywords.ts";

export const rumblingOfIArathael = definePitchFamily(fabPitchFamilies["rumbling-of-i-arathael"], {
  abilities: () => ({
    resolutionModifyKeyword: {
      kind: "resolution",
      condition: {
        type: "zone-count",
        zone: "banished",
        player: "controller",
        comparison: { op: "gte", value: 1 },
        per: "turn",
      },
      effect: grantKeyword(overpower),
    },
  }),
});

export const { red: rumblingOfIArathaelRed } = rumblingOfIArathael.cards;
