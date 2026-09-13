import { grantKeyword } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/murmur-of-i-arathael.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const murmurOfIArathael = definePitchFamily(fabPitchFamilies["murmur-of-i-arathael"], {
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
      effect: grantKeyword(goAgain),
    },
  }),
});

export const { red: murmurOfIArathaelRed } = murmurOfIArathael.cards;
