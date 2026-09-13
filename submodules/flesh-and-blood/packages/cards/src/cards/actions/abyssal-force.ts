import { grantKeyword } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/abyssal-force.generated.ts";
import { bloodDebt, goAgain, overpower } from "../shared/keywords.ts";

export const abyssalForce = definePitchFamily(fabPitchFamilies["abyssal-force"], {
  keywords: [goAgain, bloodDebt],
  abilities: () => ({
    banished: {
      kind: "static",
      staticKind: "play",
      playEffect: { role: "permission", fromZones: ["banished"] },
    },
    next: grantKeyword(overpower, {
      appliesTo: { next: { typeBox: { supertypes: ["Shadow"], subtypes: ["Attack"] } } },
    }),
  }),
});

export const { blue: abyssalForceBlue } = abyssalForce.cards;
