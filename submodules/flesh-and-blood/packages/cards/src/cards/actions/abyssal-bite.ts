import { plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/abyssal-bite.generated.ts";
import { bloodDebt, goAgain } from "../shared/keywords.ts";

export const abyssalBite = definePitchFamily(fabPitchFamilies["abyssal-bite"], {
  keywords: [goAgain, bloodDebt],
  abilities: () => ({
    banished: {
      kind: "static",
      staticKind: "play",
      playEffect: { role: "permission", fromZones: ["banished"] },
    },
    next: plusPower(1, {
      appliesTo: { next: { typeBox: { supertypes: ["Shadow"], subtypes: ["Attack"] } } },
    }),
  }),
});

export const { blue: abyssalBiteBlue } = abyssalBite.cards;
