import { grantKeyword, onHit } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/abyssal-rush.generated.ts";
import { bloodDebt, goAgain } from "../shared/keywords.ts";

export const abyssalRush = definePitchFamily(fabPitchFamilies["abyssal-rush"], {
  keywords: [goAgain, bloodDebt],
  abilities: () => ({
    banished: {
      kind: "static",
      staticKind: "play",
      playEffect: { role: "permission", fromZones: ["banished"] },
    },
    next: {
      type: "grant-property",
      property: {
        kind: "ability",
        ability: {
          ...onHit(grantKeyword(goAgain)),
          id: "onHit",
          text: "",
        },
      },
      target: { selector: "this-attack" },
      duration: "this-turn",
      appliesTo: { next: { typeBox: { supertypes: ["Shadow"], subtypes: ["Attack"] } } },
    },
  }),
});

export const { blue: abyssalRushBlue } = abyssalRush.cards;
