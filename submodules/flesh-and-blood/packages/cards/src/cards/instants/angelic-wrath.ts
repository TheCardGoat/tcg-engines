import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/angelic-wrath.generated.ts";

export const angelicWrath = definePitchFamily(fabPitchFamilies["angelic-wrath"], {
  parameters: pitchMap({
    red: 4,
    yellow: 3,
    blue: 2,
  }),
  abilities: (amount) => ({
    empowerHerald: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount,
      target: {
        selector: "object",
        declared: "on-stack",
        zones: ["combat-chain"],
        filter: attackActionFilter({ nameContains: "Herald" }),
        count: 1,
      },
      duration: "this-turn",
      outputBinding: "it",
    },
  }),
});

export const {
  red: angelicWrathRed,
  yellow: angelicWrathYellow,
  blue: angelicWrathBlue,
} = angelicWrath.cards;
